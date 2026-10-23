/**
 * NIET Intelligent Campus Resource Optimization System
 * Pure HTML, CSS, and JavaScript implementation (Vanilla DOM)
 * Schedule Engine: 8-Period Academic Day (9:10 AM - 5:00 PM) with 12:30-1:30 PM Lunch Break
 * Period 5 is 1 hour long (1:30 PM - 2:30 PM), all others 50 mins.
 * Booking Engine: Independent Block & Classroom Selection with Dynamic Filtering
 * Routing Engine: Floyd-Warshall All-Pairs Shortest Path (O(V^3))
 */

import './index.css';

interface UserAccount {
  id: string;
  name: string;
  role: 'admin' | 'user';
  department: string;
  avatarInitials: string;
  badge: string;
}

interface CampusBuilding {
  id: string;
  name: string;
  code: string;
  x: number;
  y: number;
  width: number;
  height: number;
  category: string;
  isLocked?: boolean;
  lockReason?: string;
}

interface CampusRoom {
  id: string;
  code: string;
  name: string;
  buildingId: string;
  floor: number;
  capacity: number;
  type: string;
  hasAC: boolean;
  hasSmartBoard: boolean;
}

// Academic Period Definition
interface CampusPeriod {
  periodNum: number;
  name: string;
  startTime: string; // "HH:MM" 24h
  endTime: string;   // "HH:MM" 24h
  durationMinutes: number;
  displayStart: string;
  displayEnd: string;
  isAfternoon: boolean;
}

interface SharedReservation {
  id: string;
  userId: string;
  userName: string;
  roomId: string;
  roomCode: string;
  roomName: string;
  buildingId: string;
  buildingName: string;
  floor: number;
  startPeriodNum: number;
  endPeriodNum: number;
  periodSpanLabel: string;
  startTime: string; // "09:10"
  endTime: string;   // "10:50"
  date: string;
  title: string;
  attendeesCount: number;
  walkingDistance: number;
  walkingRoute: string[];
  status: 'confirmed' | 'cancelled';
}

interface GraphEdge {
  from: string;
  to: string;
  distanceMeters: number; // Scaled down by 20
}

// -------------------------------------------------------------
// 1. Academic Day Timetable: 8 Periods from 9:10 AM to 5:00 PM
// 4 periods before lunch (50 min each)
// 12:30 - 1:30 PM: Lunch Break (1 hour)
// 4 periods after lunch:
// 5th period: 1:30 - 2:30 PM (60 min / 1 hr long)
// 6th, 7th, 8th: 50 min each
// -------------------------------------------------------------
const CAMPUS_PERIODS: CampusPeriod[] = [
  { periodNum: 1, name: 'Period 1', startTime: '09:10', endTime: '10:00', durationMinutes: 50, displayStart: '09:10 AM', displayEnd: '10:00 AM', isAfternoon: false },
  { periodNum: 2, name: 'Period 2', startTime: '10:00', endTime: '10:50', durationMinutes: 50, displayStart: '10:00 AM', displayEnd: '10:50 AM', isAfternoon: false },
  { periodNum: 3, name: 'Period 3', startTime: '10:50', endTime: '11:40', durationMinutes: 50, displayStart: '10:50 AM', displayEnd: '11:40 AM', isAfternoon: false },
  { periodNum: 4, name: 'Period 4', startTime: '11:40', endTime: '12:30', durationMinutes: 50, displayStart: '11:40 AM', displayEnd: '12:30 PM', isAfternoon: false },
  // LUNCH BREAK: 12:30 PM - 01:30 PM (60 min)
  { periodNum: 5, name: 'Period 5 (Post-Lunch)', startTime: '13:30', endTime: '14:30', durationMinutes: 60, displayStart: '01:30 PM', displayEnd: '02:30 PM', isAfternoon: true },
  { periodNum: 6, name: 'Period 6', startTime: '14:30', endTime: '15:20', durationMinutes: 50, displayStart: '02:30 PM', displayEnd: '03:20 PM', isAfternoon: true },
  { periodNum: 7, name: 'Period 7', startTime: '15:20', endTime: '16:10', durationMinutes: 50, displayStart: '03:20 PM', displayEnd: '04:10 PM', isAfternoon: true },
  { periodNum: 8, name: 'Period 8', startTime: '16:10', endTime: '17:00', durationMinutes: 50, displayStart: '04:10 PM', displayEnd: '05:00 PM', isAfternoon: true }
];

function timeToMinutes(t: string): number {
  const [h, m] = t.split(':').map(Number);
  return (h || 0) * 60 + (m || 0);
}

function isTimeOverlapping(s1: string, e1: string, s2: string, e2: string): boolean {
  const start1 = timeToMinutes(s1);
  const end1 = timeToMinutes(e1);
  const start2 = timeToMinutes(s2);
  const end2 = timeToMinutes(e2);
  return start1 < end2 && end1 > start2;
}

// -------------------------------------------------------------
// 2. Preset Users (User A, User B, Student Club, Admin)
// -------------------------------------------------------------
const PRESET_USERS: UserAccount[] = [
  {
    id: 'user-sharma',
    name: 'Prof. Sharma (User A)',
    role: 'user',
    department: 'Dept of Computer Science & Engineering',
    avatarInitials: 'UA',
    badge: 'Faculty Member'
  },
  {
    id: 'user-verma',
    name: 'Dr. Verma (User B)',
    role: 'user',
    department: 'Dept of Information Technology',
    avatarInitials: 'UB',
    badge: 'Faculty Member'
  },
  {
    id: 'user-patel',
    name: 'Sahil Patel (Student Club)',
    role: 'user',
    department: 'IEEE & Robotics Society',
    avatarInitials: 'UC',
    badge: 'Student Head'
  },
  {
    id: 'admin-dean',
    name: 'Dean Academics (Admin)',
    role: 'admin',
    department: 'Campus Facilities & Operations Directorate',
    avatarInitials: 'AD',
    badge: 'Campus Admin'
  }
];

// -------------------------------------------------------------
// 3. Campus Buildings (Layout from niet19layout.drawio_b593396b.png)
// -------------------------------------------------------------
const BUILDINGS: CampusBuilding[] = [
  { id: 'b-block-a', name: 'Block A (Main Admin)', code: 'A', x: 130, y: 80, width: 170, height: 90, category: 'Academic' },
  { id: 'b-block-b', name: 'Block B (Computing & AI)', code: 'B', x: 130, y: 220, width: 170, height: 90, category: 'Laboratory' },
  { id: 'b-block-e', name: 'Block E (Innovation Hub)', code: 'E', x: 130, y: 360, width: 170, height: 90, category: 'Innovation' },
  { id: 'b-lawn', name: 'Central Green Lawn', code: 'LAWN', x: 420, y: 220, width: 190, height: 130, category: 'Recreation' },
  { 
    id: 'b-hostel-boys', 
    name: "Boy's Hostel", 
    code: 'BH', 
    x: 100, 
    y: 520, 
    width: 140, 
    height: 90, 
    category: 'Residential', 
    isLocked: true, 
    lockReason: "Residential dormitory. Academic room reservations are strictly prohibited." 
  },
  { 
    id: 'b-block-c', 
    name: 'Block C (Core Workshops)', 
    code: 'C', 
    x: 270, 
    y: 520, 
    width: 140, 
    height: 90, 
    category: 'Laboratory', 
    isLocked: true, 
    lockReason: "Heavy machinery workshops & renovation zone. Block is locked by Dean Directive." 
  },
  { id: 'b-block-d', name: 'Block D (CSE & IT Core)', code: 'D', x: 440, y: 520, width: 170, height: 90, category: 'Academic' },
  { 
    id: 'b-hostel-girls', 
    name: "Girl's Hostel", 
    code: 'GH', 
    x: 640, 
    y: 520, 
    width: 140, 
    height: 90, 
    category: 'Residential', 
    isLocked: true, 
    lockReason: "Secure residential zone. Facility reservations are locked for academic users." 
  }
];

// Raw walkway edges (divided by 20)
const CAMPUS_EDGES: GraphEdge[] = [
  { from: 'b-block-a', to: 'b-block-b', distanceMeters: 4 },
  { from: 'b-block-b', to: 'b-block-e', distanceMeters: 4 },
  { from: 'b-block-a', to: 'b-lawn', distanceMeters: 8 },
  { from: 'b-block-b', to: 'b-lawn', distanceMeters: 6 },
  { from: 'b-block-e', to: 'b-lawn', distanceMeters: 8 },
  { from: 'b-lawn', to: 'b-block-d', distanceMeters: 9 },
  { from: 'b-block-e', to: 'b-block-d', distanceMeters: 7 },
  { from: 'b-hostel-boys', to: 'b-block-c', distanceMeters: 5 },
  { from: 'b-block-c', to: 'b-block-d', distanceMeters: 5 },
  { from: 'b-block-d', to: 'b-hostel-girls', distanceMeters: 6 }
];

// -------------------------------------------------------------
// 4. FLOYD-WARSHALL ALGORITHM ENGINE (O(V^3))
// -------------------------------------------------------------
class FloydWarshallEngine {
  private buildings: CampusBuilding[];
  private buildingIds: string[];
  public distMatrix: Record<string, Record<string, number>> = {};
  public nextMatrix: Record<string, Record<string, string | null>> = {};
  public executionMetrics = {
    nodesCount: 0,
    iterations: 0,
    timeMs: 0
  };

  constructor(buildings: CampusBuilding[], edges: GraphEdge[]) {
    this.buildings = buildings;
    this.buildingIds = buildings.map(b => b.id);
    this.runFloydWarshall(edges);
  }

  public runFloydWarshall(edges: GraphEdge[]): void {
    const startTime = performance.now();
    const INF = 999999;
    const n = this.buildingIds.length;
    this.executionMetrics.nodesCount = n;

    for (const u of this.buildingIds) {
      this.distMatrix[u] = {};
      this.nextMatrix[u] = {};
      for (const v of this.buildingIds) {
        if (u === v) {
          this.distMatrix[u][v] = 0;
          this.nextMatrix[u][v] = v;
        } else {
          this.distMatrix[u][v] = INF;
          this.nextMatrix[u][v] = null;
        }
      }
    }

    for (const edge of edges) {
      const { from, to, distanceMeters } = edge;
      if (this.distMatrix[from] && this.distMatrix[to]) {
        this.distMatrix[from][to] = distanceMeters;
        this.distMatrix[to][from] = distanceMeters;
        this.nextMatrix[from][to] = to;
        this.nextMatrix[to][from] = from;
      }
    }

    let iterations = 0;
    for (const k of this.buildingIds) {
      for (const i of this.buildingIds) {
        for (const j of this.buildingIds) {
          iterations++;
          const distThroughK = this.distMatrix[i][k] + this.distMatrix[k][j];
          if (distThroughK < this.distMatrix[i][j]) {
            this.distMatrix[i][j] = distThroughK;
            this.nextMatrix[i][j] = this.nextMatrix[i][k];
          }
        }
      }
    }

    this.executionMetrics.iterations = iterations;
    this.executionMetrics.timeMs = Math.round((performance.now() - startTime) * 100) / 100;
  }

  public getDistance(fromId: string, toId: string): number {
    if (fromId === toId) return 0;
    const d = this.distMatrix[fromId]?.[toId];
    if (d === undefined || d >= 999999) return 15;
    return d;
  }

  public getShortestPath(fromId: string, toId: string): string[] {
    if (fromId === toId) return [fromId];
    if (!this.nextMatrix[fromId] || !this.nextMatrix[fromId][toId]) return [fromId, toId];

    const path: string[] = [fromId];
    let curr = fromId;
    let guard = 0;
    while (curr !== toId && guard < 20) {
      const nextNode = this.nextMatrix[curr]?.[toId];
      if (!nextNode) break;
      curr = nextNode;
      path.push(curr);
      guard++;
    }
    return path;
  }
}

const floydWarshall = new FloydWarshallEngine(BUILDINGS, CAMPUS_EDGES);

// -------------------------------------------------------------
// 5. Campus Rooms
// -------------------------------------------------------------
const ROOMS: CampusRoom[] = [
  // Block D (CSE & IT Core)
  { id: 'r-d305', code: 'D-305', name: 'Operating Systems & Cloud Lab', buildingId: 'b-block-d', floor: 3, capacity: 60, type: 'Computer Lab', hasAC: true, hasSmartBoard: true },
  { id: 'r-d101', code: 'D-101', name: 'Alan Turing Lecture Hall', buildingId: 'b-block-d', floor: 1, capacity: 140, type: 'Lecture Hall', hasAC: true, hasSmartBoard: true },
  { id: 'r-d201', code: 'D-201', name: 'Computer Architecture Classroom', buildingId: 'b-block-d', floor: 2, capacity: 80, type: 'Lecture Hall', hasAC: false, hasSmartBoard: true },
  
  // Block B (Computing & AI Laboratories)
  { id: 'r-b105', code: 'B-105', name: 'Data Structures Lab', buildingId: 'b-block-b', floor: 1, capacity: 60, type: 'Computer Lab', hasAC: true, hasSmartBoard: true },
  { id: 'r-b205', code: 'B-205', name: 'Artificial Intelligence Lab', buildingId: 'b-block-b', floor: 2, capacity: 60, type: 'Computer Lab', hasAC: true, hasSmartBoard: true },
  { id: 'r-b305', code: 'B-305', name: 'Networks & Cybersecurity Lab', buildingId: 'b-block-b', floor: 3, capacity: 60, type: 'Computer Lab', hasAC: true, hasSmartBoard: false },
  
  // Block A (Main Admin & Kalam Auditorium)
  { id: 'r-a101', code: 'A-101', name: 'APJ Abdul Kalam Grand Auditorium', buildingId: 'b-block-a', floor: 1, capacity: 320, type: 'Auditorium', hasAC: true, hasSmartBoard: true },
  { id: 'r-a201', code: 'A-201', name: 'Executive Council Seminar Hall', buildingId: 'b-block-a', floor: 2, capacity: 100, type: 'Seminar Room', hasAC: true, hasSmartBoard: true },
  { id: 'r-a301', code: 'A-301', name: 'Foundation Lecture Theatre', buildingId: 'b-block-a', floor: 3, capacity: 90, type: 'Lecture Hall', hasAC: false, hasSmartBoard: true },

  // Block E (Innovation & Incubation Hub)
  { id: 'r-e101', code: 'E-101', name: 'Robotics & Drone Systems Lab', buildingId: 'b-block-e', floor: 1, capacity: 50, type: 'Robotics & IoT Lab', hasAC: true, hasSmartBoard: true },
  { id: 'r-e201', code: 'E-201', name: 'Startup Incubation Arena', buildingId: 'b-block-e', floor: 2, capacity: 75, type: 'Seminar Room', hasAC: true, hasSmartBoard: true },

  // Block C (Locked)
  { id: 'r-c101', code: 'C-101', name: 'Heavy Machinery & CNC Workshop', buildingId: 'b-block-c', floor: 1, capacity: 60, type: 'Laboratory', hasAC: false, hasSmartBoard: false },

  // Hostels (Locked)
  { id: 'r-bh-mess', code: 'BH-COMM', name: "Boy's Hostel Common Hall", buildingId: 'b-hostel-boys', floor: 1, capacity: 150, type: 'Hall', hasAC: false, hasSmartBoard: false },
  { id: 'r-gh-mess', code: 'GH-COMM', name: "Girl's Hostel Activity Center", buildingId: 'b-hostel-girls', floor: 1, capacity: 150, type: 'Hall', hasAC: false, hasSmartBoard: false }
];

// Preset time span options for the booking dropdown
const TIME_SPAN_PRESETS = [
  { id: 'p1', startPeriod: 1, endPeriod: 1, label: 'Period 1 • 09:10 AM - 10:00 AM (50 min)' },
  { id: 'p2', startPeriod: 2, endPeriod: 2, label: 'Period 2 • 10:00 AM - 10:50 AM (50 min)' },
  { id: 'p3', startPeriod: 3, endPeriod: 3, label: 'Period 3 • 10:50 AM - 11:40 AM (50 min)' },
  { id: 'p4', startPeriod: 4, endPeriod: 4, label: 'Period 4 • 11:40 AM - 12:30 PM (50 min)' },
  { id: 'p1-2', startPeriod: 1, endPeriod: 2, label: 'Period 1 & 2 • 09:10 AM - 10:50 AM (2-Period Lab • 100 min)' },
  { id: 'p3-4', startPeriod: 3, endPeriod: 4, label: 'Period 3 & 4 • 10:50 AM - 12:30 PM (2-Period Lab • 100 min)' },
  { id: 'morning-half', startPeriod: 1, endPeriod: 4, label: 'Morning Block • 09:10 AM - 12:30 PM (Periods 1-4 • 200 min)' },
  { id: 'p5', startPeriod: 5, endPeriod: 5, label: 'Period 5 • 01:30 PM - 02:30 PM (1 Hour Long)' },
  { id: 'p6', startPeriod: 6, endPeriod: 6, label: 'Period 6 • 02:30 PM - 03:20 PM (50 min)' },
  { id: 'p7', startPeriod: 7, endPeriod: 7, label: 'Period 7 • 03:20 PM - 04:10 PM (50 min)' },
  { id: 'p8', startPeriod: 8, endPeriod: 8, label: 'Period 8 • 04:10 PM - 05:00 PM (50 min)' },
  { id: 'p5-6', startPeriod: 5, endPeriod: 6, label: 'Period 5 & 6 • 01:30 PM - 03:20 PM (2-Period Lab • 110 min)' },
  { id: 'p7-8', startPeriod: 7, endPeriod: 8, label: 'Period 7 & 8 • 03:20 PM - 05:00 PM (2-Period Lab • 100 min)' },
  { id: 'afternoon-half', startPeriod: 5, endPeriod: 8, label: 'Afternoon Block • 01:30 PM - 05:00 PM (Periods 5-8 • 210 min)' },
  { id: 'custom', startPeriod: 1, endPeriod: 2, label: '⚡ Custom Period Span (Pick Start & End)...' }
];

// App State
class CampusAppState {
  currentUser: UserAccount = PRESET_USERS[0]; // Default: User A
  activeTab: 'book' | 'map' | 'schedule' | 'directory' | 'admin' = 'book';
  selectedBuildingForMap: string = 'b-block-d';
  sourceBuildingForMap: string = 'b-block-a';
  prefilledRoomCode: string | null = null;
  showFloydWarshallMatrix: boolean = false;
  
  // Dedicated Block & Classroom Selection State for Book Space
  selectedBlockForBooking: string = 'b-block-d'; // 'auto' | building id
  selectedClassForBooking: string = 'r-d305';    // 'auto' | room id

  // Active Form Span State
  selectedPresetId: string = 'p1-2';
  selectedStartPeriod: number = 1;
  selectedEndPeriod: number = 2;

  // Shared Reservations across all users (Single Source of Truth)
  // Seed with User A booking D-305 for Period 1 & 2 (09:10 - 10:50 AM)
  reservations: SharedReservation[] = [
    {
      id: 'RES-D305-UA',
      userId: 'user-sharma',
      userName: 'Prof. Sharma (User A)',
      roomId: 'r-d305',
      roomCode: 'D-305',
      roomName: 'Operating Systems & Cloud Lab',
      buildingId: 'b-block-d',
      buildingName: 'Block D (CSE & IT Core)',
      floor: 3,
      startPeriodNum: 1,
      endPeriodNum: 2,
      periodSpanLabel: 'Period 1 & 2 (09:10 AM - 10:50 AM)',
      startTime: '09:10',
      endTime: '10:50',
      date: '2026-10-23',
      title: 'Operating Systems Practicum (Batch A1 • 2-Period Lab)',
      attendeesCount: 55,
      walkingDistance: floydWarshall.getDistance('b-block-a', 'b-block-d'),
      walkingRoute: floydWarshall.getShortestPath('b-block-a', 'b-block-d'),
      status: 'confirmed'
    }
  ];

  lastConfirmation: SharedReservation | null = null;
  isLoginModalOpen: boolean = false;
}

const state = new CampusAppState();

// Check if any reservation overlaps with requested time span
function checkConflict(roomId: string, startTime: string, endTime: string): SharedReservation | undefined {
  if (roomId === 'auto') return undefined;
  return state.reservations.find(r => 
    r.roomId === roomId && 
    r.status === 'confirmed' && 
    isTimeOverlapping(r.startTime, r.endTime, startTime, endTime)
  );
}

// -------------------------------------------------------------
// DOM Renderer
// -------------------------------------------------------------
function render() {
  const root = document.getElementById('root');
  if (!root) return;

  const isAdmin = state.currentUser.role === 'admin';
  const myReservationsCount = state.reservations.filter(r => r.userId === state.currentUser.id && r.status === 'confirmed').length;

  root.innerHTML = `
    <div class="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      
      <!-- Top Announcement / Multi-User Switcher Bar -->
      <div class="bg-slate-900 border-b border-slate-800 text-xs px-4 py-2 sticky top-0 z-50 shadow-md">
        <div class="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div class="flex items-center gap-2">
            <span class="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span class="font-bold text-white tracking-tight">NIET CampusSpace</span>
            <span class="text-slate-600 hidden sm:inline">•</span>
            <span class="text-slate-400 hidden sm:inline">Block & Classroom Specific Booking</span>
            <span class="bg-indigo-950 text-indigo-300 text-[10px] px-2 py-0.5 rounded border border-indigo-800">
              Floyd-Warshall Engine
            </span>
          </div>

          <!-- Quick User Switch Buttons -->
          <div class="flex items-center gap-2">
            <span class="text-slate-400 text-[11px] hidden md:inline">Current Active User:</span>
            <button id="btn-open-user-modal" class="flex items-center gap-2 px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg border border-slate-700 text-xs font-semibold transition-all">
              <span class="w-5 h-5 rounded-md bg-indigo-600 text-white flex items-center justify-center text-[10px] font-bold">
                ${state.currentUser.avatarInitials}
              </span>
              <span>${state.currentUser.name}</span>
              <span class="text-slate-400 text-[10px]">▼ Switch</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Main Navigation Bar -->
      <header class="bg-slate-900/80 backdrop-blur border-b border-slate-800 px-4 py-3 sticky top-[41px] z-40">
        <div class="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div class="flex items-center gap-3">
            <div class="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-sky-400 flex items-center justify-center shadow-lg shadow-indigo-600/30 text-white font-black text-sm">
              CS
            </div>
            <div>
              <h1 class="text-base font-bold text-white tracking-tight leading-none">NIET CampusSpace</h1>
              <p class="text-[11px] text-slate-400 mt-1">Choose Block & Class • 8 Academic Periods • Mutual Collision Protection</p>
            </div>
          </div>

          <!-- Tabs -->
          <nav class="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 overflow-x-auto text-xs">
            <button data-tab="book" class="nav-tab px-3 py-1.5 rounded-lg font-semibold transition-all ${state.activeTab === 'book' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'}">
              Book Space
            </button>
            <button data-tab="map" class="nav-tab px-3 py-1.5 rounded-lg font-semibold transition-all ${state.activeTab === 'map' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'}">
              Campus Map
            </button>
            <button data-tab="schedule" class="nav-tab px-3 py-1.5 rounded-lg font-semibold transition-all ${state.activeTab === 'schedule' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'}">
              My Bookings ${myReservationsCount > 0 ? `<span class="ml-1 px-1.5 py-0.2 bg-indigo-500/40 text-indigo-200 rounded-full text-[10px]">${myReservationsCount}</span>` : ''}
            </button>
            <button data-tab="directory" class="nav-tab px-3 py-1.5 rounded-lg font-semibold transition-all ${state.activeTab === 'directory' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'}">
              Rooms Directory
            </button>
            ${isAdmin ? `
              <button data-tab="admin" class="nav-tab px-3 py-1.5 rounded-lg font-semibold transition-all ${state.activeTab === 'admin' ? 'bg-amber-600 text-white shadow' : 'text-amber-400 hover:text-amber-200'}">
                Admin Console
              </button>
            ` : ''}
          </nav>
        </div>
      </header>

      <!-- Main Workspace -->
      <main class="flex-1 max-w-7xl w-full mx-auto px-4 py-6">
        ${renderActiveTab()}
      </main>

      <!-- Clean Product Footer -->
      <footer class="bg-slate-900 border-t border-slate-800 text-xs text-slate-400 py-6 px-4 mt-auto">
        <div class="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <span class="font-semibold text-white">NIET Greater Noida Autonomous Campus</span>
            <p class="text-[11px] text-slate-500 mt-0.5">
              Target Block & Classroom Selection • 8 Periods (9:10-17:00, 1h lunch) • Floyd-Warshall APSP (÷20)
            </p>
          </div>
          <div class="flex items-center gap-3 text-[11px]">
            <span class="text-emerald-400">● Live User: ${state.currentUser.name}</span>
            <span class="text-slate-700">|</span>
            <button id="btn-footer-switch" class="text-indigo-400 hover:text-indigo-300 underline font-semibold">
              Switch Account
            </button>
          </div>
        </div>
      </footer>

      <!-- Login / Switch User Modal -->
      ${renderLoginModal()}
    </div>
  `;

  bindEvents();
}

// -------------------------------------------------------------
// Sub-views
// -------------------------------------------------------------

function renderActiveTab(): string {
  switch (state.activeTab) {
    case 'book': return renderBookTab();
    case 'map': return renderMapTab();
    case 'schedule': return renderScheduleTab();
    case 'directory': return renderDirectoryTab();
    case 'admin': return renderAdminTab();
    default: return renderBookTab();
  }
}

// Render dynamic Classroom options based on selected block
function renderClassOptionsForBlock(blockId: string): string {
  if (blockId === 'auto') {
    return `
      <option value="auto">✨ Any Classroom (Auto-Allocate Closest with Capacity)</option>
      <optgroup label="Block D (CSE & IT Core)">
        <option value="r-d305" ${state.selectedClassForBooking === 'r-d305' ? 'selected' : ''}>D-305 — OS & Cloud Lab (Floor 3, 60 Seats)</option>
        <option value="r-d101" ${state.selectedClassForBooking === 'r-d101' ? 'selected' : ''}>D-101 — Alan Turing Hall (Floor 1, 140 Seats)</option>
        <option value="r-d201" ${state.selectedClassForBooking === 'r-d201' ? 'selected' : ''}>D-201 — CS Architecture Class (Floor 2, 80 Seats)</option>
      </optgroup>
      <optgroup label="Block B (Computing & AI)">
        <option value="r-b105" ${state.selectedClassForBooking === 'r-b105' ? 'selected' : ''}>B-105 — Data Structures Lab (Floor 1, 60 Seats)</option>
        <option value="r-b205" ${state.selectedClassForBooking === 'r-b205' ? 'selected' : ''}>B-205 — AI Research Lab (Floor 2, 60 Seats)</option>
        <option value="r-b305" ${state.selectedClassForBooking === 'r-b305' ? 'selected' : ''}>B-305 — Networks Lab (Floor 3, 60 Seats)</option>
      </optgroup>
      <optgroup label="Block A (Main Admin)">
        <option value="r-a101" ${state.selectedClassForBooking === 'r-a101' ? 'selected' : ''}>A-101 — Kalam Grand Auditorium (Floor 1, 320 Seats)</option>
        <option value="r-a201" ${state.selectedClassForBooking === 'r-a201' ? 'selected' : ''}>A-201 — Council Seminar Hall (Floor 2, 100 Seats)</option>
        <option value="r-a301" ${state.selectedClassForBooking === 'r-a301' ? 'selected' : ''}>A-301 — Foundation Theatre (Floor 3, 90 Seats)</option>
      </optgroup>
      <optgroup label="Block E (Innovation Hub)">
        <option value="r-e101" ${state.selectedClassForBooking === 'r-e101' ? 'selected' : ''}>E-101 — Robotics & Drone Lab (Floor 1, 50 Seats)</option>
        <option value="r-e201" ${state.selectedClassForBooking === 'r-e201' ? 'selected' : ''}>E-201 — Incubation Arena (Floor 2, 75 Seats)</option>
      </optgroup>
    `;
  }

  const bldg = BUILDINGS.find(b => b.id === blockId);
  if (bldg?.isLocked) {
    return `<option value="" disabled selected>🔒 Block is Locked — No Classrooms Available</option>`;
  }

  const roomsInBlock = ROOMS.filter(r => r.buildingId === blockId);
  return `
    <option value="auto" ${state.selectedClassForBooking === 'auto' ? 'selected' : ''}>
      ✨ Auto-Pick Best Room in ${bldg?.name.split(' (')[0] || 'Block'}
    </option>
    ${roomsInBlock.map(room => `
      <option value="${room.id}" ${state.selectedClassForBooking === room.id ? 'selected' : ''}>
        ${room.code} — ${room.name} (Floor ${room.floor}, ${room.capacity} Seats)
      </option>
    `).join('')}
  `;
}

// 1. BOOK SPACE TAB
function renderBookTab(): string {
  const startP = CAMPUS_PERIODS.find(p => p.periodNum === state.selectedStartPeriod) || CAMPUS_PERIODS[0];
  const endP = CAMPUS_PERIODS.find(p => p.periodNum === state.selectedEndPeriod) || CAMPUS_PERIODS[1];
  const startTime = startP.startTime;
  const endTime = endP.endTime;

  const currentBldg = BUILDINGS.find(b => b.id === state.selectedBlockForBooking);
  const isBlockLocked = currentBldg?.isLocked;
  const activeClassRoomId = state.selectedClassForBooking === 'auto' ? 'r-d305' : state.selectedClassForBooking;

  return `
    <div class="space-y-6 max-w-5xl mx-auto pb-12">
      <!-- Booking Form -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div class="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-5">
          <div class="flex items-center justify-between pb-2 border-b border-slate-800">
            <div>
              <h2 class="text-lg font-bold text-white flex items-center gap-2">
                <span>Reserve a Campus Space</span>
              </h2>
              <p class="text-xs text-slate-400 mt-0.5">
                Choose the target campus block and specific classroom or laboratory.
              </p>
            </div>
            <span class="text-[10px] bg-slate-950 border border-slate-800 text-indigo-300 px-2.5 py-1 rounded-xl font-mono">
              Block & Class Selection
            </span>
          </div>

          <form id="booking-form" class="space-y-4 text-xs">
            <!-- Event Title -->
            <div>
              <label class="block text-slate-300 font-semibold mb-1.5">Lecture / Practicum Title:</label>
              <input
                id="form-title"
                type="text"
                value="Operating Systems Practicum"
                class="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-indigo-500"
                required
              />
            </div>

            <!-- CHOOSE BLOCK & CLASS SECTION (Requested by User) -->
            <div class="p-3.5 bg-slate-950/90 rounded-2xl border border-slate-800 space-y-3">
              <div class="flex items-center justify-between">
                <span class="text-xs font-bold text-white flex items-center gap-1.5">
                  <span class="w-2 h-2 rounded-full bg-indigo-400"></span>
                  Facility Target:
                </span>
                <span class="text-[10px] text-slate-400">Choose block and classroom</span>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <!-- 1. Choose Block -->
                <div>
                  <label class="block text-slate-300 font-semibold mb-1 flex items-center justify-between text-[11px]">
                    <span>1. Choose Campus Block:</span>
                    <span class="text-[10px] text-indigo-400">Step 1</span>
                  </label>
                  <select id="form-block" class="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-indigo-500 text-xs">
                    <option value="auto" ${state.selectedBlockForBooking === 'auto' ? 'selected' : ''}>✨ Any Block (Auto-Pick Closest)</option>
                    <optgroup label="Academic & Laboratory Blocks (Available)">
                      <option value="b-block-d" ${state.selectedBlockForBooking === 'b-block-d' ? 'selected' : ''}>Block D (CSE & IT Core Academic)</option>
                      <option value="b-block-b" ${state.selectedBlockForBooking === 'b-block-b' ? 'selected' : ''}>Block B (Computing & AI Laboratories)</option>
                      <option value="b-block-a" ${state.selectedBlockForBooking === 'b-block-a' ? 'selected' : ''}>Block A (Main Admin & Kalam Auditorium)</option>
                      <option value="b-block-e" ${state.selectedBlockForBooking === 'b-block-e' ? 'selected' : ''}>Block E (Innovation & Incubation Hub)</option>
                    </optgroup>
                    <optgroup label="Restricted / Locked Zones">
                      <option value="b-block-c" ${state.selectedBlockForBooking === 'b-block-c' ? 'selected' : ''}>🔒 Block C (Workshops) - Locked</option>
                      <option value="b-hostel-boys" ${state.selectedBlockForBooking === 'b-hostel-boys' ? 'selected' : ''}>🔒 Boy's Hostel - Locked</option>
                      <option value="b-hostel-girls" ${state.selectedBlockForBooking === 'b-hostel-girls' ? 'selected' : ''}>🔒 Girl's Hostel - Locked</option>
                    </optgroup>
                  </select>
                </div>

                <!-- 2. Choose Classroom -->
                <div>
                  <label class="block text-slate-300 font-semibold mb-1 flex items-center justify-between text-[11px]">
                    <span>2. Choose Classroom / Lab:</span>
                    <span class="text-[10px] text-indigo-400">Step 2</span>
                  </label>
                  <select 
                    id="form-class" 
                    class="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-indigo-500 text-xs ${isBlockLocked ? 'opacity-50 cursor-not-allowed' : ''}"
                    ${isBlockLocked ? 'disabled' : ''}
                  >
                    ${renderClassOptionsForBlock(state.selectedBlockForBooking)}
                  </select>
                </div>
              </div>

              <!-- Locked Block Warning if selected -->
              ${isBlockLocked ? `
                <div class="p-3 bg-amber-950/70 border border-amber-800/80 rounded-xl text-xs text-amber-200 flex items-start gap-2">
                  <span class="text-sm">🔒</span>
                  <div>
                    <span class="font-bold text-amber-300">${currentBldg?.name} is Restricted</span>
                    <p class="text-[11px] text-amber-200/90 mt-0.5">${currentBldg?.lockReason}</p>
                  </div>
                </div>
              ` : ''}
            </div>

            <!-- TIME SPAN SELECTION SECTION -->
            <div class="p-3.5 bg-slate-950/80 rounded-2xl border border-slate-800 space-y-3">
              <div class="flex items-center justify-between">
                <span class="text-xs font-bold text-white flex items-center gap-1.5">
                  <span class="w-2 h-2 rounded-full bg-indigo-400"></span>
                  Booking Time Span:
                </span>
                <span class="text-[11px] font-mono text-indigo-300 font-semibold" id="label-active-span">
                  ${startP.periodNum === endP.periodNum ? `${startP.name} (${startP.startTime} - ${startP.endTime})` : `Periods ${startP.periodNum}-${endP.periodNum} (${startP.startTime} - ${endP.endTime})`}
                </span>
              </div>

              <!-- Preset Selectors -->
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label class="block text-slate-400 text-[11px] mb-1">Standard Period / Span Presets:</label>
                  <select id="form-preset-span" class="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500 text-xs">
                    ${TIME_SPAN_PRESETS.map(preset => `
                      <option value="${preset.id}" ${state.selectedPresetId === preset.id ? 'selected' : ''}>
                        ${preset.label}
                      </option>
                    `).join('')}
                  </select>
                </div>

                <!-- Custom Start/End Selectors -->
                <div class="grid grid-cols-2 gap-2">
                  <div>
                    <label class="block text-slate-400 text-[11px] mb-1">Start Period:</label>
                    <select id="form-start-period" class="w-full bg-slate-900 border border-slate-800 rounded-xl px-2.5 py-2 text-white focus:outline-none focus:border-indigo-500 text-xs">
                      ${CAMPUS_PERIODS.map(p => `
                        <option value="${p.periodNum}" ${state.selectedStartPeriod === p.periodNum ? 'selected' : ''}>
                          P${p.periodNum} (${p.startTime})
                        </option>
                      `).join('')}
                    </select>
                  </div>
                  <div>
                    <label class="block text-slate-400 text-[11px] mb-1">End Period:</label>
                    <select id="form-end-period" class="w-full bg-slate-900 border border-slate-800 rounded-xl px-2.5 py-2 text-white focus:outline-none focus:border-indigo-500 text-xs">
                      ${CAMPUS_PERIODS.map(p => `
                        <option value="${p.periodNum}" ${state.selectedEndPeriod === p.periodNum ? 'selected' : ''}>
                          P${p.periodNum} (${p.endTime})
                        </option>
                      `).join('')}
                    </select>
                  </div>
                </div>
              </div>

              <!-- TIMETABLE PERIOD STRIP VISUALIZER -->
              <div class="pt-2 border-t border-slate-800/80 space-y-1.5">
                <div class="flex items-center justify-between text-[10px] text-slate-400">
                  <span>Room Schedule for <strong>${ROOMS.find(r => r.id === activeClassRoomId)?.code || 'D-305'}</strong> (Click to select period):</span>
                  <span>Lunch Break: 12:30 - 01:30 PM</span>
                </div>

                <div class="grid grid-cols-9 gap-1 text-[10px] select-none">
                  ${renderPeriodTimelineButton(1, activeClassRoomId)}
                  ${renderPeriodTimelineButton(2, activeClassRoomId)}
                  ${renderPeriodTimelineButton(3, activeClassRoomId)}
                  ${renderPeriodTimelineButton(4, activeClassRoomId)}
                  
                  <!-- Lunch Column -->
                  <div class="p-1 rounded-lg bg-slate-900 border border-slate-800 flex flex-col items-center justify-center text-center opacity-70 cursor-not-allowed">
                    <span class="text-[9px] text-amber-400 font-bold leading-none">🥪 LUNCH</span>
                    <span class="text-[8px] text-slate-500 mt-0.5">12:30-1:30</span>
                  </div>

                  ${renderPeriodTimelineButton(5, activeClassRoomId)}
                  ${renderPeriodTimelineButton(6, activeClassRoomId)}
                  ${renderPeriodTimelineButton(7, activeClassRoomId)}
                  ${renderPeriodTimelineButton(8, activeClassRoomId)}
                </div>
              </div>
            </div>

            <!-- Attendees & Origin Block -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="block text-slate-300 font-semibold mb-1.5">Expected Attendees:</label>
                <input
                  id="form-attendees"
                  type="number"
                  min="10"
                  max="350"
                  value="55"
                  class="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label class="block text-slate-300 font-semibold mb-1.5">Your Location (Origin Block):</label>
                <select id="form-origin" class="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-indigo-500">
                  <option value="b-block-a">Block A (Main Entrance & Admin)</option>
                  <option value="b-block-b">Block B (Computing Center)</option>
                  <option value="b-block-e">Block E (Innovation Center)</option>
                  <option value="b-block-d">Block D (CSE & IT)</option>
                </select>
              </div>
            </div>

            <!-- DYNAMIC CONFLICT BANNER CONTAINER -->
            <div id="conflict-banner-container">
              ${renderConflictBanner(state.selectedClassForBooking, startTime, endTime)}
            </div>

            <!-- Submit Button -->
            <div class="pt-2">
              <button
                id="btn-submit-booking"
                type="submit"
                class="w-full py-3 rounded-xl font-bold text-xs bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30 transition-all cursor-pointer ${isBlockLocked ? 'opacity-50 cursor-not-allowed bg-slate-800' : ''}"
                ${isBlockLocked ? 'disabled' : ''}
              >
                ${isBlockLocked ? '🔒 Selected Block is Locked' : `Confirm Reservation for ${state.currentUser.name}`}
              </button>
            </div>
          </form>
        </div>

        <!-- Right Side: Live Confirmation & User State -->
        <div class="space-y-4">
          <!-- Active User Profile Card -->
          <div class="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-lg space-y-3">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center font-bold text-sm">
                ${state.currentUser.avatarInitials}
              </div>
              <div>
                <h4 class="font-bold text-white text-sm">${state.currentUser.name}</h4>
                <p class="text-[11px] text-slate-400">${state.currentUser.department}</p>
              </div>
            </div>
            <div class="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
              <span class="text-slate-400">Role: <strong class="text-slate-200">${state.currentUser.badge}</strong></span>
              <span class="text-emerald-400 font-semibold">Active Session</span>
            </div>
          </div>

          <!-- Last Confirmed Receipt -->
          ${state.lastConfirmation ? `
            <div class="bg-slate-900 border border-emerald-900/60 rounded-3xl p-5 shadow-xl space-y-3">
              <div class="flex items-center justify-between pb-2 border-b border-slate-800">
                <span class="text-xs font-bold text-emerald-400 uppercase tracking-wider">● Confirmed Receipt</span>
                <span class="text-[10px] font-mono text-slate-400 bg-slate-950 px-2 py-0.5 rounded">${state.lastConfirmation.id}</span>
              </div>
              <div>
                <h3 class="text-2xl font-black text-white font-mono">${state.lastConfirmation.roomCode}</h3>
                <p class="text-xs font-semibold text-slate-200">${state.lastConfirmation.roomName}</p>
                <p class="text-[11px] text-slate-400">${state.lastConfirmation.buildingName} • Floor ${state.lastConfirmation.floor}</p>
              </div>
              <div class="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-[11px] space-y-1">
                <div class="flex justify-between">
                  <span class="text-slate-400">Span:</span>
                  <span class="font-mono text-indigo-300 font-bold">${state.lastConfirmation.periodSpanLabel}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-slate-400">Time:</span>
                  <span class="font-mono text-white">${state.lastConfirmation.startTime} - ${state.lastConfirmation.endTime}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-slate-400">Floyd-Warshall Route:</span>
                  <span class="font-mono text-emerald-400 font-bold">${state.lastConfirmation.walkingDistance}m (&lt; 1 min)</span>
                </div>
                <div class="text-[10px] text-slate-400 pt-1 border-t border-slate-800">
                  Route: ${state.lastConfirmation.walkingRoute.map(bId => BUILDINGS.find(b => b.id === bId)?.code || bId).join(' → ')}
                </div>
              </div>
              <button id="btn-view-receipt-map" class="w-full py-2 bg-indigo-600/80 hover:bg-indigo-600 text-white rounded-xl text-xs font-semibold transition-colors">
                View Walking Route on Map →
              </button>
            </div>
          ` : `
            <div class="bg-slate-900/60 border border-slate-800/80 rounded-3xl p-5 text-center text-xs text-slate-400 space-y-2">
              <div class="w-8 h-8 rounded-full bg-slate-800 text-slate-400 mx-auto flex items-center justify-center font-bold">i</div>
              <p>Select your target block, classroom, and period span. Real-time conflict checks will prevent double-bookings.</p>
            </div>
          `}
        </div>
      </div>
    </div>
  `;
}

// Render small pill for a period in the visualizer
function renderPeriodTimelineButton(periodNum: number, roomId: string): string {
  const p = CAMPUS_PERIODS.find(item => item.periodNum === periodNum);
  if (!p) return '';

  const conflict = checkConflict(roomId, p.startTime, p.endTime);
  const isSelected = periodNum >= state.selectedStartPeriod && periodNum <= state.selectedEndPeriod;

  return `
    <button
      type="button"
      class="timeline-period-btn p-1.5 rounded-lg border text-center transition-all flex flex-col items-center justify-center ${
        conflict
          ? 'bg-rose-950/80 border-rose-700/80 text-rose-300 cursor-pointer'
          : isSelected
          ? 'bg-indigo-600 border-indigo-400 text-white ring-1 ring-indigo-300 font-bold'
          : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-800'
      }"
      data-period="${periodNum}"
      title="${p.name} (${p.startTime} - ${p.endTime})${conflict ? ` - Reserved by ${conflict.userName}` : ' - Available'}"
    >
      <span class="font-bold leading-none">P${periodNum}</span>
      <span class="text-[8px] opacity-80 mt-0.5">${p.startTime}</span>
      ${conflict ? `<span class="text-[7px] text-rose-400 font-bold uppercase mt-0.5">Booked</span>` : ''}
    </button>
  `;
}

function renderConflictBanner(roomId: string, startTime: string, endTime: string): string {
  if (roomId === 'auto') return '';
  
  const conflict = checkConflict(roomId, startTime, endTime);
  if (conflict) {
    const isMe = conflict.userId === state.currentUser.id;
    return `
      <div class="p-3.5 bg-rose-950/70 border border-rose-700/80 rounded-2xl text-xs text-rose-200 space-y-1">
        <div class="font-bold flex items-center gap-1.5 text-rose-300">
          <span>⚠️ Classroom Already Reserved!</span>
        </div>
        <p class="text-[11px] text-rose-200/90 leading-relaxed">
          ${isMe 
            ? `You already have <strong>${conflict.roomCode}</strong> reserved during this span (<strong>${conflict.periodSpanLabel}</strong>).` 
            : `Classroom <strong>${conflict.roomCode}</strong> is already booked by <strong>${conflict.userName}</strong> for <strong>${conflict.periodSpanLabel}</strong>. You cannot double-book this classroom.`
          }
        </p>
        <p class="text-[10px] text-rose-400 font-medium">
          Please select another classroom in this block, choose another block, or select an open period span.
        </p>
      </div>
    `;
  }
  return '';
}

// 2. CAMPUS MAP TAB WITH FLOYD-WARSHALL ROUTING
function renderMapTab(): string {
  const selectedBldg = BUILDINGS.find(b => b.id === state.selectedBuildingForMap) || BUILDINGS[0];
  const shortestDistance = floydWarshall.getDistance(state.sourceBuildingForMap, state.selectedBuildingForMap);
  const shortestPathIds = floydWarshall.getShortestPath(state.sourceBuildingForMap, state.selectedBuildingForMap);
  const shortestPathNames = shortestPathIds.map(id => BUILDINGS.find(b => b.id === id)?.name.split(' (')[0] || id);
  const roomsInBldg = ROOMS.filter(r => r.buildingId === selectedBldg.id);

  const pathCoordinates = shortestPathIds.map(id => {
    const b = BUILDINGS.find(item => item.id === id);
    return b ? { x: b.x + b.width / 2, y: b.y + b.height / 2 } : { x: 0, y: 0 };
  });

  return `
    <div class="space-y-6 max-w-6xl mx-auto pb-12">
      <!-- Header with Floyd-Warshall Badge -->
      <div class="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-lg flex flex-wrap items-center justify-between gap-4">
        <div>
          <div class="flex items-center gap-2">
            <h2 class="text-base font-bold text-white">Campus Layout & Walking Map</h2>
            <span class="text-[10px] font-semibold text-indigo-300 bg-indigo-950 border border-indigo-800 px-2.5 py-0.5 rounded-full flex items-center gap-1">
              ⚡ Floyd-Warshall Shortest Path
            </span>
            <span class="text-[10px] font-semibold text-amber-400 bg-amber-950/80 px-2.5 py-0.5 rounded-full border border-amber-800">
              🔒 Hostels & Block C Locked
            </span>
          </div>
          <p class="text-xs text-slate-400 mt-1">
            Exact NIET layout. Distances scaled by 20. Evaluates shortest walkway paths across all 8 periods.
          </p>
        </div>

        <!-- Route Selectors & Matrix Toggle -->
        <div class="flex flex-wrap items-center gap-2 text-xs">
          <div class="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
            <span class="text-slate-400 px-1">From:</span>
            <select id="map-select-source" class="bg-slate-900 border-none rounded-lg px-2 py-1 text-white text-xs">
              <option value="b-block-a" ${state.sourceBuildingForMap === 'b-block-a' ? 'selected' : ''}>Block A</option>
              <option value="b-block-b" ${state.sourceBuildingForMap === 'b-block-b' ? 'selected' : ''}>Block B</option>
              <option value="b-block-e" ${state.sourceBuildingForMap === 'b-block-e' ? 'selected' : ''}>Block E</option>
              <option value="b-block-d" ${state.sourceBuildingForMap === 'b-block-d' ? 'selected' : ''}>Block D</option>
            </select>

            <span class="text-slate-400 px-1">To:</span>
            <select id="map-select-target" class="bg-slate-900 border-none rounded-lg px-2 py-1 text-white text-xs">
              ${BUILDINGS.map(b => `
                <option value="${b.id}" ${state.selectedBuildingForMap === b.id ? 'selected' : ''}>
                  ${b.name} ${b.isLocked ? '[Locked]' : ''}
                </option>
              `).join('')}
            </select>
          </div>

          <button id="btn-toggle-fw-matrix" class="px-3 py-1.5 rounded-xl font-semibold text-xs border ${state.showFloydWarshallMatrix ? 'bg-indigo-600 text-white border-indigo-500' : 'bg-slate-800 text-slate-200 border-slate-700 hover:bg-slate-700'} transition-all">
            📊 ${state.showFloydWarshallMatrix ? 'Hide' : 'View'} Floyd-Warshall Matrix
          </button>
        </div>
      </div>

      <!-- Collapsible Floyd-Warshall All-Pairs Distance Matrix Table -->
      ${state.showFloydWarshallMatrix ? `
        <div class="bg-slate-900 border border-indigo-900/60 rounded-3xl p-5 shadow-2xl space-y-3 animate-in fade-in">
          <div class="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-slate-800">
            <div>
              <h3 class="text-sm font-bold text-white flex items-center gap-2">
                <span>Floyd-Warshall All-Pairs Shortest Path Matrix D[V][V]</span>
                <span class="text-[10px] bg-indigo-950 text-indigo-300 px-2 py-0.5 rounded border border-indigo-800 font-mono">
                  ${floydWarshall.executionMetrics.iterations} operations (${floydWarshall.executionMetrics.timeMs}ms)
                </span>
              </h3>
              <p class="text-[11px] text-slate-400">
                Quantitative shortest distances between every building pair across the NIET campus graph. Click any cell to plot route!
              </p>
            </div>
            <span class="text-[10px] text-emerald-400 font-mono">Distances in Meters (÷20)</span>
          </div>

          <div class="overflow-x-auto">
            <table class="w-full text-center text-xs font-mono">
              <thead>
                <tr class="text-slate-400 border-b border-slate-800 text-[11px]">
                  <th class="p-2 text-left">From \\ To</th>
                  ${BUILDINGS.map(b => `<th class="p-2 ${b.isLocked ? 'text-amber-400' : 'text-slate-300'}">${b.code}</th>`).join('')}
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-800/60">
                ${BUILDINGS.map(fromB => `
                  <tr class="hover:bg-slate-800/40 transition-colors">
                    <td class="p-2 text-left font-sans font-semibold text-slate-300 text-[11px]">
                      ${fromB.name.split(' (')[0]} ${fromB.isLocked ? '🔒' : ''}
                    </td>
                    ${BUILDINGS.map(toB => {
                      const d = floydWarshall.getDistance(fromB.id, toB.id);
                      const isSelf = fromB.id === toB.id;
                      const isCurrentPair = state.sourceBuildingForMap === fromB.id && state.selectedBuildingForMap === toB.id;

                      return `
                        <td 
                          class="p-2 cursor-pointer transition-all ${
                            isCurrentPair 
                              ? 'bg-indigo-600/40 text-white font-bold ring-1 ring-indigo-400 rounded' 
                              : isSelf 
                              ? 'text-slate-600' 
                              : d >= 999999 
                              ? 'text-rose-500' 
                              : 'text-indigo-300 hover:bg-indigo-950 hover:text-white'
                          } matrix-cell"
                          data-from="${fromB.id}"
                          data-to="${toB.id}"
                          title="Route from ${fromB.name} to ${toB.name}: ${d >= 999999 ? 'Unreachable' : `${d} meters`}"
                        >
                          ${isSelf ? '0m' : d >= 999999 ? '∞' : `${d}m`}
                        </td>
                      `;
                    }).join('')}
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>
      ` : ''}

      <!-- Map Grid & Sidebar -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <!-- Interactive SVG Canvas (8 cols) -->
        <div class="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-3xl p-4 shadow-xl flex flex-col justify-between">
          <div class="w-full aspect-[16/10] bg-slate-950 rounded-2xl relative overflow-hidden border border-slate-800/80">
            <svg class="w-full h-full" viewBox="0 0 850 650">
              <!-- Grid background -->
              <defs>
                <pattern id="grid" width="30" height="30" patternUnits="userSpaceOnUse">
                  <path d="M 30 0 L 0 0 0 30" fill="none" stroke="#1e293b" stroke-width="0.5" />
                </pattern>
                <linearGradient id="routeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stop-color="#818cf8" />
                  <stop offset="100%" stop-color="#38bdf8" />
                </linearGradient>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />

              <!-- Base Campus Walkways (All Raw Edges) -->
              <g stroke="#334155" stroke-width="2" stroke-dasharray="4,4">
                <line x1="215" y1="125" x2="215" y2="265" />
                <line x1="215" y1="265" x2="215" y2="405" />
                <line x1="215" y1="125" x2="515" y2="285" />
                <line x1="215" y1="265" x2="515" y2="285" />
                <line x1="215" y1="405" x2="515" y2="285" />
                <line x1="515" y1="285" x2="525" y2="565" />
                <line x1="215" y1="405" x2="525" y2="565" />
                <line x1="170" y1="565" x2="340" y2="565" stroke="#451a03" stroke-width="1.5" />
                <line x1="340" y1="565" x2="525" y2="565" stroke="#451a03" stroke-width="1.5" />
                <line x1="525" y1="565" x2="710" y2="565" stroke="#451a03" stroke-width="1.5" />
              </g>

              <!-- Central Lawn -->
              <g>
                <rect x="360" y="160" width="220" height="240" rx="20" fill="#064e3b" fill-opacity="0.25" stroke="#059669" stroke-width="1.5" />
                <text x="470" y="270" text-anchor="middle" fill="#34d399" font-size="14" font-weight="bold">Central Open Lawn</text>
                <text x="470" y="290" text-anchor="middle" fill="#6ee7b7" font-size="10">NIET Green Quadrangle</text>
              </g>

              <!-- Floyd-Warshall Computed Optimal Shortest Path -->
              ${pathCoordinates.length > 1 ? `
                <g stroke="url(#routeGradient)" stroke-width="5" stroke-linecap="round" stroke-linejoin="round">
                  ${pathCoordinates.map((pt, idx) => {
                    if (idx === 0) return '';
                    const prev = pathCoordinates[idx - 1];
                    return `<line x1="${prev.x}" y1="${prev.y}" x2="${pt.x}" y2="${pt.y}" />`;
                  }).join('')}
                </g>
                ${pathCoordinates.map((pt, idx) => `
                  <circle cx="${pt.x}" cy="${pt.y}" r="6" fill="${idx === 0 ? '#10b981' : idx === pathCoordinates.length - 1 ? '#6366f1' : '#38bdf8'}" stroke="#ffffff" stroke-width="2" />
                `).join('')}
              ` : ''}

              <!-- Buildings -->
              ${BUILDINGS.map(b => {
                const isSelected = b.id === state.selectedBuildingForMap;
                const isSource = b.id === state.sourceBuildingForMap;
                const isInPath = shortestPathIds.includes(b.id);

                return `
                  <g class="cursor-pointer group building-rect" data-building-id="${b.id}">
                    <rect
                      x="${b.x}"
                      y="${b.y}"
                      width="${b.width}"
                      height="${b.height}"
                      rx="14"
                      fill="${
                        b.isLocked 
                          ? '#2a1208' 
                          : isSelected 
                          ? '#1e1b4b' 
                          : isSource
                          ? '#064e3b'
                          : isInPath
                          ? '#1e293b'
                          : '#0f172a'
                      }"
                      stroke="${
                        b.isLocked 
                          ? '#b45309' 
                          : isSelected 
                          ? '#6366f1' 
                          : isSource
                          ? '#10b981'
                          : isInPath
                          ? '#38bdf8'
                          : '#334155'
                      }"
                      stroke-width="${isSelected || isSource ? '3' : isInPath ? '2' : '1.5'}"
                    />
                    <text
                      x="${b.x + b.width / 2}"
                      y="${b.y + (b.isLocked ? 38 : 45)}"
                      textAnchor="middle"
                      fill="${b.isLocked ? '#f59e0b' : '#ffffff'}"
                      font-size="12"
                      font-weight="bold"
                    >
                      ${b.name}
                    </text>
                    ${b.isLocked ? `
                      <text x="${b.x + b.width / 2}" y="${b.y + 60}" textAnchor="middle" fill="#fcd34d" font-size="10" font-weight="bold">
                        🔒 LOCKED
                      </text>
                    ` : `
                      <text x="${b.x + b.width / 2}" y="${b.y + 65}" textAnchor="middle" fill="#94a3b8" font-size="10">
                        ${b.code} • ${b.category}
                      </text>
                    `}
                  </g>
                `;
              }).join('')}
            </svg>
          </div>

          <!-- Bottom Route Summary from Floyd-Warshall -->
          <div class="mt-3 p-3 bg-slate-950/80 rounded-2xl border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs">
            <div>
              <span class="text-slate-400">Floyd-Warshall Shortest Route:</span>
              <strong class="text-indigo-300 font-mono ml-1">
                ${shortestPathNames.join(' → ')}
              </strong>
            </div>
            <div class="flex items-center gap-3">
              <span class="text-emerald-400 font-mono font-bold">${shortestDistance}m (&lt; 1 min walk)</span>
              <span class="text-slate-600">|</span>
              <span class="text-slate-400 text-[11px]">Scaled 1:20</span>
            </div>
          </div>
        </div>

        <!-- Sidebar Facility Details (4 cols) -->
        <div class="lg:col-span-4 bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4">
          <div class="pb-3 border-b border-slate-800">
            <div class="flex items-center justify-between">
              <h3 class="font-bold text-white text-base">${selectedBldg.name}</h3>
              <span class="text-xs px-2 py-0.5 rounded-full font-mono font-bold ${selectedBldg.isLocked ? 'bg-amber-950 text-amber-300 border border-amber-800' : 'bg-indigo-950 text-indigo-300 border border-indigo-800'}">
                ${selectedBldg.code}
              </span>
            </div>
            <p class="text-xs text-slate-400 mt-1">${selectedBldg.category} Block</p>
          </div>

          ${selectedBldg.isLocked ? `
            <div class="p-3.5 bg-amber-950/60 border border-amber-800/80 rounded-2xl text-xs text-amber-200 space-y-1.5">
              <div class="font-bold text-amber-300">🔒 Access Restricted / Facility Locked</div>
              <p class="text-[11px] leading-relaxed text-amber-200/90">${selectedBldg.lockReason}</p>
              <p class="text-[10px] text-amber-400 font-semibold">Automated bookings are strictly prohibited for this block.</p>
            </div>
          ` : `
            <div class="space-y-3">
              <span class="text-xs font-semibold text-slate-400 block">Facilities in this Block:</span>
              <div class="space-y-2">
                ${roomsInBldg.map(room => {
                  const activeRes = state.reservations.find(r => r.roomId === room.id && r.status === 'confirmed');
                  return `
                    <div class="p-3 rounded-2xl bg-slate-950 border ${activeRes ? 'border-amber-800/60 bg-amber-950/10' : 'border-slate-800'} flex items-center justify-between text-xs">
                      <div>
                        <div class="font-bold text-white font-mono flex items-center gap-1.5">
                          <span>${room.code}</span>
                          ${activeRes ? `<span class="text-[9px] bg-amber-950 text-amber-300 px-1.5 py-0.2 rounded border border-amber-700">Reserved</span>` : ''}
                        </div>
                        <div class="text-[11px] text-slate-300 truncate max-w-[140px]">${room.name}</div>
                        <div class="text-[10px] text-slate-500 mt-0.5">${room.capacity} seats • Floor ${room.floor}</div>
                        ${activeRes ? `
                          <div class="text-[10px] text-amber-300 mt-0.5">
                            ${activeRes.periodSpanLabel} (${activeRes.userName.replace(/ \(User [AB]\)/, '')})
                          </div>
                        ` : ''}
                      </div>

                      <div>
                        <button class="btn-book-room-code px-2.5 py-1 ${activeRes ? 'bg-amber-900/40 text-amber-300 border border-amber-700' : 'bg-indigo-600 hover:bg-indigo-500 text-white'} rounded-lg text-[10px] font-semibold" data-code="${room.code}">
                          ${activeRes ? 'View' : 'Book'}
                        </button>
                      </div>
                    </div>
                  `;
                }).join('')}
              </div>
            </div>
          `}
        </div>
      </div>
    </div>
  `;
}

// 3. MY BOOKINGS TAB
function renderScheduleTab(): string {
  const isAdmin = state.currentUser.role === 'admin';
  const myBookings = state.reservations.filter(r => r.userId === state.currentUser.id && r.status === 'confirmed');
  const allBookings = state.reservations.filter(r => r.status === 'confirmed');
  const list = isAdmin ? allBookings : myBookings;

  return `
    <div class="space-y-6 max-w-5xl mx-auto pb-12">
      <div class="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-lg flex flex-wrap items-center justify-between gap-4">
        <div>
          <div class="flex items-center gap-2">
            <h2 class="text-lg font-bold text-white">
              ${isAdmin ? 'Central Campus Schedule (All Bookings)' : `My Confirmed Bookings (${state.currentUser.name})`}
            </h2>
          </div>
          <p class="text-xs text-slate-400 mt-1">
            Review your time spans across the 8 academic periods or cancel to free slots for others.
          </p>
        </div>

        <button id="btn-schedule-book-another" class="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow-md shadow-indigo-600/30 transition-all">
          + Book Another Space
        </button>
      </div>

      <!-- Bookings Cards -->
      ${list.length > 0 ? `
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          ${list.map(b => {
            const isMine = b.userId === state.currentUser.id;

            return `
              <div class="bg-slate-900 border ${isMine ? 'border-indigo-900/60' : 'border-slate-800'} rounded-3xl p-5 shadow-lg space-y-4">
                <div class="flex items-center justify-between pb-3 border-b border-slate-800">
                  <span class="text-xs font-bold text-emerald-400">● Confirmed Reservation</span>
                  <div class="flex items-center gap-2">
                    <span class="text-[10px] px-2 py-0.5 rounded-full ${isMine ? 'bg-indigo-950 text-indigo-300 border border-indigo-800' : 'bg-amber-950 text-amber-300 border border-amber-800'} font-semibold">
                      ${isMine ? 'Booked by You' : `Booked by ${b.userName}`}
                    </span>
                    <span class="text-xs font-mono text-slate-400 bg-slate-950 px-2 py-0.5 rounded">${b.id}</span>
                  </div>
                </div>

                <div>
                  <div class="flex items-baseline justify-between">
                    <h3 class="text-2xl font-black text-white font-mono">${b.roomCode}</h3>
                    <span class="text-xs font-semibold text-indigo-300 bg-indigo-950 px-2.5 py-0.5 rounded-full">Floor ${b.floor}</span>
                  </div>
                  <div class="text-sm font-semibold text-slate-200 mt-0.5">${b.roomName}</div>
                  <div class="text-xs text-slate-400 mt-1">${b.buildingName}</div>
                </div>

                <div class="p-3 bg-slate-950 rounded-2xl border border-slate-800 text-xs space-y-1">
                  <div class="font-semibold text-white truncate">${b.title}</div>
                  <div class="flex justify-between text-slate-400 text-[11px]">
                    <span>Period: <strong class="text-indigo-300 font-mono">${b.periodSpanLabel}</strong></span>
                    <span>Distance: <strong class="text-emerald-400">${b.walkingDistance}m</strong></span>
                  </div>
                  <div class="flex justify-between text-slate-400 text-[10px] pt-1 border-t border-slate-800/80">
                    <span>Time Window: <strong class="text-white">${b.startTime} - ${b.endTime}</strong></span>
                    <span>Date: ${b.date}</span>
                  </div>
                </div>

                <div class="pt-2 border-t border-slate-800 flex items-center justify-between gap-2">
                  <button class="btn-goto-map flex-1 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold" data-bldg="${b.buildingId}">
                    View Map Route
                  </button>
                  ${isMine || isAdmin ? `
                    <button class="btn-cancel-reservation px-3 py-2 bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 border border-rose-800/60 rounded-xl text-xs font-semibold" data-id="${b.id}">
                      ${isAdmin && !isMine ? 'Admin Release' : 'Cancel Slot'}
                    </button>
                  ` : ''}
                </div>
              </div>
            `;
          }).join('')}
        </div>
      ` : `
        <div class="bg-slate-900 border border-slate-800 rounded-3xl p-10 text-center space-y-3">
          <h3 class="text-base font-bold text-white">No Active Bookings for ${state.currentUser.name}</h3>
          <p class="text-xs text-slate-400 max-w-sm mx-auto">
            You currently have no reserved spaces. Go to the booking tab to reserve any of the 8 academic periods.
          </p>
        </div>
      `}
    </div>
  `;
}

// 4. ROOMS DIRECTORY TAB
function renderDirectoryTab(): string {
  return `
    <div class="space-y-6 max-w-6xl mx-auto pb-12">
      <div class="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-lg flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 class="text-base sm:text-lg font-bold text-white">Campus Facilities Directory</h2>
          <p class="text-xs text-slate-400 mt-1">
            Browse all lecture halls, computer labs, and auditoriums across NIET Greater Noida with live period schedule.
          </p>
        </div>
        <span class="text-xs px-3 py-1 bg-emerald-950 text-emerald-400 border border-emerald-800 rounded-full font-semibold">
          ● 8 Periods Schedule Active
        </span>
      </div>

      <!-- Facilities Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        ${ROOMS.map(room => {
          const bldg = BUILDINGS.find(b => b.id === room.buildingId);
          const isLocked = bldg?.isLocked;
          const roomReservations = state.reservations.filter(r => r.roomId === room.id && r.status === 'confirmed');

          return `
            <div class="bg-slate-900 border ${isLocked ? 'border-amber-900/40 bg-amber-950/10' : roomReservations.length > 0 ? 'border-indigo-800/60' : 'border-slate-800'} rounded-3xl p-5 shadow-lg flex flex-col justify-between space-y-4">
              <div class="space-y-2">
                <div class="flex items-center justify-between">
                  <span class="text-lg font-black text-white font-mono">${room.code}</span>
                  ${isLocked ? `
                    <span class="text-[10px] font-semibold text-amber-400 bg-amber-950 border border-amber-800 px-2 py-0.5 rounded-full">
                      🔒 Locked Facility
                    </span>
                  ` : roomReservations.length > 0 ? `
                    <span class="text-[10px] font-semibold text-amber-300 bg-amber-950 border border-amber-800 px-2 py-0.5 rounded-full">
                      ${roomReservations.length} Active Booking${roomReservations.length > 1 ? 's' : ''}
                    </span>
                  ` : `
                    <span class="text-[10px] font-semibold text-emerald-400 bg-emerald-950 border border-emerald-800 px-2 py-0.5 rounded-full">
                      All Periods Free
                    </span>
                  `}
                </div>

                <div>
                  <h4 class="text-sm font-semibold text-slate-200">${room.name}</h4>
                  <p class="text-xs text-slate-400">${bldg?.name} • Floor ${room.floor}</p>
                </div>

                <div class="flex items-center gap-2 text-xs">
                  <span class="px-2.5 py-1 rounded-xl bg-slate-950 text-indigo-300 border border-slate-800 font-mono font-bold">${room.capacity} Seats</span>
                  <span class="px-2.5 py-1 rounded-xl bg-slate-950 text-slate-400 border border-slate-800">${room.type}</span>
                </div>

                <!-- Mini Timeline of Periods for this Room -->
                ${!isLocked ? `
                  <div class="pt-2 border-t border-slate-800/60 space-y-1">
                    <span class="text-[10px] text-slate-400 block">Daily Period Occupancy:</span>
                    <div class="grid grid-cols-8 gap-0.5 text-center text-[9px] font-mono">
                      ${CAMPUS_PERIODS.map(p => {
                        const hasBooking = roomReservations.some(r => isTimeOverlapping(r.startTime, r.endTime, p.startTime, p.endTime));
                        return `
                          <div class="p-1 rounded ${hasBooking ? 'bg-rose-950 text-rose-300 border border-rose-800 font-bold' : 'bg-slate-950 text-slate-400 border border-slate-800'}" title="${p.name} (${p.startTime}-${p.endTime}): ${hasBooking ? 'Booked' : 'Free'}">
                            P${p.periodNum}
                          </div>
                        `;
                      }).join('')}
                    </div>
                  </div>
                ` : ''}
              </div>

              <div class="pt-3 border-t border-slate-800">
                ${isLocked ? `
                  <button disabled class="w-full py-2 bg-amber-950/40 border border-amber-800/40 text-amber-400/80 font-medium text-xs rounded-xl cursor-not-allowed">
                    🔒 Facility Locked
                  </button>
                ` : `
                  <button class="btn-book-room-code w-full py-2 bg-indigo-600/80 hover:bg-indigo-600 text-white font-semibold text-xs rounded-xl transition-colors" data-code="${room.code}">
                    Book This Space →
                  </button>
                `}
              </div>
            </div>
          `;
        }).join('')}
      </div>
    </div>
  `;
}

// 5. ADMIN TAB
function renderAdminTab(): string {
  return `
    <div class="space-y-6 max-w-5xl mx-auto pb-12">
      <div class="bg-slate-900 border border-amber-900/50 rounded-3xl p-6 shadow-xl space-y-2">
        <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-950 text-amber-300 text-xs font-semibold border border-amber-800">
          Campus Administration Panel
        </div>
        <h2 class="text-xl font-bold text-white">Central Space Management & Overrides</h2>
        <p class="text-xs text-slate-300">
          Supervise all active reservations across the 8 academic periods (9:10 AM - 5:00 PM). Release any slot to resolve priority clashes.
        </p>
      </div>

      <!-- Reservations Table -->
      <div class="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-lg">
        <div class="p-4 border-b border-slate-800 flex justify-between items-center text-xs">
          <span class="font-bold text-white">System Reservations (${state.reservations.length} Active)</span>
          <span class="text-slate-400">Zero Double-Bookings Enforced</span>
        </div>

        <div class="divide-y divide-slate-800 text-xs">
          ${state.reservations.map(res => `
            <div class="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <div class="flex items-center gap-2">
                  <span class="font-bold text-white font-mono text-sm">${res.roomCode}</span>
                  <span class="text-[10px] px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-slate-300">${res.buildingName}</span>
                  <span class="text-[10px] px-2 py-0.5 rounded bg-indigo-950 border border-indigo-800 text-indigo-300 font-semibold">${res.userName}</span>
                </div>
                <p class="text-slate-300 text-xs mt-1">
                  ${res.title} • Span: <strong class="text-indigo-300">${res.periodSpanLabel}</strong> (${res.startTime} - ${res.endTime})
                </p>
              </div>

              <button class="btn-cancel-reservation px-3 py-1.5 bg-rose-950 text-rose-300 border border-rose-800 rounded-lg font-semibold hover:bg-rose-900/80 transition-colors" data-id="${res.id}">
                Admin Release Slot
              </button>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  `;
}

// 6. LOGIN MODAL
function renderLoginModal(): string {
  if (!state.isLoginModalOpen) return '';

  return `
    <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div class="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-md shadow-2xl p-6 space-y-4">
        <div class="flex items-center justify-between pb-3 border-b border-slate-800">
          <div>
            <h3 class="text-base font-bold text-white">Switch Account / Login</h3>
            <p class="text-xs text-slate-400">Select faculty, student society, or administration account</p>
          </div>
          <button id="btn-close-modal" class="text-slate-400 hover:text-white p-1 text-sm font-bold">✕</button>
        </div>

        <div class="space-y-2">
          ${PRESET_USERS.map(u => `
            <button
              class="btn-select-user w-full p-3 rounded-2xl border text-left flex items-center justify-between transition-all ${
                state.currentUser.id === u.id 
                  ? 'bg-indigo-600/20 border-indigo-500 text-white ring-1 ring-indigo-500/50' 
                  : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
              }"
              data-user-id="${u.id}"
            >
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-xl bg-slate-800 text-indigo-300 border border-slate-700 flex items-center justify-center font-bold text-xs">
                  ${u.avatarInitials}
                </div>
                <div>
                  <div class="font-bold text-white text-xs">${u.name}</div>
                  <div class="text-[11px] text-slate-400">${u.department}</div>
                </div>
              </div>
              <span class="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">${u.badge}</span>
            </button>
          `).join('')}
        </div>
      </div>
    </div>
  `;
}

// -------------------------------------------------------------
// Event Listeners (Pure Vanilla JS)
// -------------------------------------------------------------
function bindEvents() {
  // Navigation tabs
  document.querySelectorAll('.nav-tab').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const tab = (e.currentTarget as HTMLElement).dataset.tab as any;
      if (tab) {
        state.activeTab = tab;
        render();
      }
    });
  });

  // Modal triggers
  const openModalBtn = document.getElementById('btn-open-user-modal');
  if (openModalBtn) {
    openModalBtn.addEventListener('click', () => {
      state.isLoginModalOpen = true;
      render();
    });
  }

  const footerSwitch = document.getElementById('btn-footer-switch');
  if (footerSwitch) {
    footerSwitch.addEventListener('click', () => {
      state.isLoginModalOpen = true;
      render();
    });
  }

  const closeModalBtn = document.getElementById('btn-close-modal');
  if (closeModalBtn) {
    closeModalBtn.addEventListener('click', () => {
      state.isLoginModalOpen = false;
      render();
    });
  }

  // Select user in modal
  document.querySelectorAll('.btn-select-user').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const uId = (e.currentTarget as HTMLElement).dataset.userId;
      const found = PRESET_USERS.find(u => u.id === uId);
      if (found) {
        state.currentUser = found;
        state.isLoginModalOpen = false;
        if (found.role === 'admin') {
          state.activeTab = 'admin';
        }
        render();
      }
    });
  });

  // Toggle Floyd-Warshall Matrix
  const toggleMatrixBtn = document.getElementById('btn-toggle-fw-matrix');
  if (toggleMatrixBtn) {
    toggleMatrixBtn.addEventListener('click', () => {
      state.showFloydWarshallMatrix = !state.showFloydWarshallMatrix;
      render();
    });
  }

  // Matrix cell click to visualize route
  document.querySelectorAll('.matrix-cell').forEach(cell => {
    cell.addEventListener('click', (e) => {
      const from = (e.currentTarget as HTMLElement).dataset.from;
      const to = (e.currentTarget as HTMLElement).dataset.to;
      if (from && to) {
        state.sourceBuildingForMap = from;
        state.selectedBuildingForMap = to;
        render();
      }
    });
  });

  // Timeline Period Buttons Click
  document.querySelectorAll('.timeline-period-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const pNum = Number((e.currentTarget as HTMLElement).dataset.period);
      if (pNum) {
        state.selectedPresetId = 'custom';
        state.selectedStartPeriod = pNum;
        state.selectedEndPeriod = pNum;
        render();
      }
    });
  });

  // 1. Target Block Select change (Updates classroom dropdown and filters)
  const formBlock = document.getElementById('form-block') as HTMLSelectElement;
  if (formBlock) {
    formBlock.addEventListener('change', (e) => {
      const bldgId = (e.target as HTMLSelectElement).value;
      state.selectedBlockForBooking = bldgId;

      // When block changes, adjust class selection
      if (bldgId === 'auto') {
        state.selectedClassForBooking = 'auto';
      } else {
        const roomsInBlock = ROOMS.filter(r => r.buildingId === bldgId);
        if (roomsInBlock.length > 0) {
          state.selectedClassForBooking = roomsInBlock[0].id;
        } else {
          state.selectedClassForBooking = 'auto';
        }
      }
      render();
    });
  }

  // 2. Target Classroom Select change
  const formClass = document.getElementById('form-class') as HTMLSelectElement;
  if (formClass) {
    formClass.addEventListener('change', (e) => {
      state.selectedClassForBooking = (e.target as HTMLSelectElement).value;
      render();
    });
  }

  // Preset Span Select change
  const presetSpanSelect = document.getElementById('form-preset-span') as HTMLSelectElement;
  if (presetSpanSelect) {
    presetSpanSelect.addEventListener('change', (e) => {
      const val = (e.target as HTMLSelectElement).value;
      state.selectedPresetId = val;
      const found = TIME_SPAN_PRESETS.find(p => p.id === val);
      if (found && val !== 'custom') {
        state.selectedStartPeriod = found.startPeriod;
        state.selectedEndPeriod = found.endPeriod;
      }
      render();
    });
  }

  // Custom Start Period Select change
  const startPeriodSelect = document.getElementById('form-start-period') as HTMLSelectElement;
  if (startPeriodSelect) {
    startPeriodSelect.addEventListener('change', (e) => {
      const sp = Number((e.target as HTMLSelectElement).value);
      state.selectedStartPeriod = sp;
      if (state.selectedEndPeriod < sp) {
        state.selectedEndPeriod = sp;
      }
      state.selectedPresetId = 'custom';
      render();
    });
  }

  // Custom End Period Select change
  const endPeriodSelect = document.getElementById('form-end-period') as HTMLSelectElement;
  if (endPeriodSelect) {
    endPeriodSelect.addEventListener('change', (e) => {
      const ep = Number((e.target as HTMLSelectElement).value);
      state.selectedEndPeriod = Math.max(ep, state.selectedStartPeriod);
      state.selectedPresetId = 'custom';
      render();
    });
  }

  // Handle Booking Form Submit
  const bookingForm = document.getElementById('booking-form');
  if (bookingForm) {
    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const title = (document.getElementById('form-title') as HTMLInputElement).value;
      const attendees = Number((document.getElementById('form-attendees') as HTMLInputElement).value);
      const origin = (document.getElementById('form-origin') as HTMLSelectElement).value;

      const chosenBlockId = state.selectedBlockForBooking;
      const chosenClassId = state.selectedClassForBooking;

      const currentBldg = BUILDINGS.find(b => b.id === chosenBlockId);
      if (currentBldg?.isLocked) {
        alert(`${currentBldg.name} is currently locked. Room booking is disabled.`);
        return;
      }

      const startP = CAMPUS_PERIODS.find(p => p.periodNum === state.selectedStartPeriod) || CAMPUS_PERIODS[0];
      const endP = CAMPUS_PERIODS.find(p => p.periodNum === state.selectedEndPeriod) || CAMPUS_PERIODS[1];
      const startTime = startP.startTime;
      const endTime = endP.endTime;
      const spanLabel = startP.periodNum === endP.periodNum
        ? `${startP.name} (${startP.startTime} - ${startP.endTime})`
        : `Periods ${startP.periodNum}-${endP.periodNum} (${startP.startTime} - ${endP.endTime})`;

      let chosenRoom: CampusRoom | undefined;

      if (chosenClassId === 'auto') {
        // Auto-allocate candidate rooms:
        // If a specific block was chosen, filter to that block; otherwise across all open blocks
        const validRooms = ROOMS.filter(r => {
          if (chosenBlockId !== 'auto' && r.buildingId !== chosenBlockId) return false;
          const bldg = BUILDINGS.find(b => b.id === r.buildingId);
          if (bldg?.isLocked) return false;
          if (r.capacity < attendees) return false;
          const conflict = checkConflict(r.id, startTime, endTime);
          return !conflict;
        });

        if (validRooms.length === 0) {
          alert('No facilities available matching this capacity without conflicts in this period span. Try another period or block.');
          return;
        }

        // Sort by Floyd-Warshall computed shortest distance to origin
        validRooms.sort((a, b) => floydWarshall.getDistance(origin, a.buildingId) - floydWarshall.getDistance(origin, b.buildingId));
        chosenRoom = validRooms[0];
      } else {
        chosenRoom = ROOMS.find(r => r.id === chosenClassId);
      }

      if (!chosenRoom) {
        alert('Invalid classroom selected');
        return;
      }

      const bldg = BUILDINGS.find(b => b.id === chosenRoom!.buildingId);
      const shortestDistance = floydWarshall.getDistance(origin, chosenRoom.buildingId);
      const shortestPath = floydWarshall.getShortestPath(origin, chosenRoom.buildingId);

      const newReservation: SharedReservation = {
        id: `RES-${Date.now().toString().slice(-4)}`,
        userId: state.currentUser.id,
        userName: state.currentUser.name,
        roomId: chosenRoom.id,
        roomCode: chosenRoom.code,
        roomName: chosenRoom.name,
        buildingId: chosenRoom.buildingId,
        buildingName: bldg?.name || 'Academic Block',
        floor: chosenRoom.floor,
        startPeriodNum: startP.periodNum,
        endPeriodNum: endP.periodNum,
        periodSpanLabel: spanLabel,
        startTime: startTime,
        endTime: endTime,
        date: '2026-10-23',
        title: title || 'Scheduled Academic Session',
        attendeesCount: attendees,
        walkingDistance: shortestDistance,
        walkingRoute: shortestPath,
        status: 'confirmed'
      };

      state.reservations.unshift(newReservation);
      state.lastConfirmation = newReservation;
      state.prefilledRoomCode = null;
      render();
    });
  }

  // Cancel reservation
  document.querySelectorAll('.btn-cancel-reservation').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const resId = (e.currentTarget as HTMLElement).dataset.id;
      if (resId) {
        state.reservations = state.reservations.filter(r => r.id !== resId);
        if (state.lastConfirmation?.id === resId) {
          state.lastConfirmation = null;
        }
        render();
      }
    });
  });

  // Building click on SVG map
  document.querySelectorAll('.building-rect').forEach(rect => {
    rect.addEventListener('click', (e) => {
      const bId = (e.currentTarget as HTMLElement).dataset.buildingId;
      if (bId) {
        state.selectedBuildingForMap = bId;
        render();
      }
    });
  });

  // Map Source/Target selectors
  const mapSelectSource = document.getElementById('map-select-source') as HTMLSelectElement;
  if (mapSelectSource) {
    mapSelectSource.addEventListener('change', (e) => {
      state.sourceBuildingForMap = (e.target as HTMLSelectElement).value;
      render();
    });
  }

  const mapSelectTarget = document.getElementById('map-select-target') as HTMLSelectElement;
  if (mapSelectTarget) {
    mapSelectTarget.addEventListener('change', (e) => {
      state.selectedBuildingForMap = (e.target as HTMLSelectElement).value;
      render();
    });
  }

  // Book room code button (from Map or Directory)
  document.querySelectorAll('.btn-book-room-code').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const code = (e.currentTarget as HTMLElement).dataset.code;
      if (code) {
        state.prefilledRoomCode = code;
        const found = ROOMS.find(r => r.code === code);
        if (found) {
          state.selectedBlockForBooking = found.buildingId;
          state.selectedClassForBooking = found.id;
        }
        state.activeTab = 'book';
        render();
      }
    });
  });

  // Go to map button from schedule
  document.querySelectorAll('.btn-goto-map').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const bldgId = (e.currentTarget as HTMLElement).dataset.bldg;
      if (bldgId) {
        state.selectedBuildingForMap = bldgId;
        state.activeTab = 'map';
        render();
      }
    });
  });

  // Receipt map link
  const receiptMapBtn = document.getElementById('btn-view-receipt-map');
  if (receiptMapBtn) {
    receiptMapBtn.addEventListener('click', () => {
      if (state.lastConfirmation) {
        state.selectedBuildingForMap = state.lastConfirmation.buildingId;
        state.activeTab = 'map';
        render();
      }
    });
  }

  // Schedule book another
  const bookAnotherBtn = document.getElementById('btn-schedule-book-another');
  if (bookAnotherBtn) {
    bookAnotherBtn.addEventListener('click', () => {
      state.activeTab = 'book';
      render();
    });
  }
}

// Initial Boot
document.addEventListener('DOMContentLoaded', () => {
  render();
});

if (document.readyState === 'complete' || document.readyState === 'interactive') {
  render();
}
