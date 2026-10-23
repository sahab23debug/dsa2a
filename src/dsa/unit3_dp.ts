/**
 * Unit 3: Dynamic Programming Algorithms Implementation
 * Based on NIET PBL Final Report: Intelligent Campus Resource Optimization System
 * Topics: 0/1 Knapsack (Room Capacity & Utility Maximization),
 * Longest Common Subsequence (Timetable Pattern Matching),
 * Matrix Chain Multiplication (Database Join Query Optimization).
 */

// ==========================================
// 1. 0/1 Knapsack Problem (Room Capacity Matching)
// ==========================================
export interface StudentSectionRequest {
  id: string;
  name: string;
  studentsCount: number; // weight
  academicUtility: number; // value (priority/accreditation weight)
}

export interface KnapsackResult {
  maxUtility: number;
  selectedRequests: StudentSectionRequest[];
  totalStudentsPlaced: number;
  capacity: number;
  wasteSeats: number;
  dpTable: number[][];
  requests: StudentSectionRequest[];
}

export function solveKnapsackRoomAllocation(
  capacity: number,
  requests: StudentSectionRequest[] = [
    { id: 'SEC-A1', name: 'CSE Cloud Computing Lab', studentsCount: 55, academicUtility: 90 },
    { id: 'SEC-B1', name: 'AI Machine Learning Practicum', studentsCount: 50, academicUtility: 82 },
    { id: 'SEC-C1', name: 'Cybersecurity Penetration Testing', studentsCount: 35, academicUtility: 65 },
    { id: 'SEC-D1', name: 'Robotics Embedded Systems', studentsCount: 40, academicUtility: 70 },
    { id: 'SEC-E1', name: 'IoT Sensor Networks Workshop', studentsCount: 25, academicUtility: 45 }
  ]
): KnapsackResult {
  const n = requests.length;
  // dp[i][w] = maximum utility with first i requests and max capacity w
  // To keep table readable for visualization, we step by 5 or exact capacity
  const dp: number[][] = Array.from({ length: n + 1 }, () => Array(capacity + 1).fill(0));

  for (let i = 1; i <= n; i++) {
    const item = requests[i - 1];
    for (let w = 0; w <= capacity; w++) {
      if (item.studentsCount <= w) {
        dp[i][w] = Math.max(
          dp[i - 1][w],
          item.academicUtility + dp[i - 1][w - item.studentsCount]
        );
      } else {
        dp[i][w] = dp[i - 1][w];
      }
    }
  }

  // Backtrack to find selected items
  const selected: StudentSectionRequest[] = [];
  let w = capacity;
  for (let i = n; i > 0; i--) {
    if (dp[i][w] !== dp[i - 1][w]) {
      selected.push(requests[i - 1]);
      w -= requests[i - 1].studentsCount;
    }
  }

  const totalStudentsPlaced = selected.reduce((acc, curr) => acc + curr.studentsCount, 0);

  return {
    maxUtility: dp[n][capacity],
    selectedRequests: selected,
    totalStudentsPlaced,
    capacity,
    wasteSeats: capacity - totalStudentsPlaced,
    dpTable: dp,
    requests
  };
}

// ==========================================
// 2. Longest Common Subsequence (LCS)
// Timetable Pattern Matching between Faculty Schedules
// ==========================================
export interface LCSResult {
  seq1: string[];
  seq2: string[];
  commonSubsequence: string[];
  length: number;
  matrix: number[][];
  overlapDescription: string;
}

export function solveTimetableLCS(
  seq1: string[] = ['Lab-D305', 'Lecture-A101', 'Lab-B105', 'Seminar-A201', 'Lab-E101'],
  seq2: string[] = ['Lecture-A101', 'Lab-D305', 'Lab-B105', 'Lab-E101', 'Office-Hours']
): LCSResult {
  const m = seq1.length;
  const n = seq2.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (seq1[i - 1] === seq2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
    }
  }

  // Backtrack to reconstruct the LCS
  let i = m;
  let j = n;
  const lcsItems: string[] = [];

  while (i > 0 && j > 0) {
    if (seq1[i - 1] === seq2[j - 1]) {
      lcsItems.unshift(seq1[i - 1]);
      i--;
      j--;
    } else if (dp[i - 1][j] >= dp[i][j - 1]) {
      i--;
    } else {
      j--;
    }
  }

  return {
    seq1,
    seq2,
    commonSubsequence: lcsItems,
    length: dp[m][n],
    matrix: dp,
    overlapDescription: `Found ${dp[m][n]} synchronous recurring facility allocations across weekly timetables.`
  };
}

// ==========================================
// 3. Matrix Chain Multiplication (MCM)
// Campus Relational Query Join Optimization
// ==========================================
export interface MCMResult {
  dimensions: number[];
  tableNames: string[];
  minMultiplications: number;
  costMatrix: number[][];
  bracketMatrix: number[][];
  optimalParentheses: string;
}

export function solveMatrixChainQueryOptimization(
  dimensions: number[] = [10, 100, 5, 50, 20],
  tableNames: string[] = ['Rooms(R)', 'Bookings(B)', 'Faculty(F)', 'Courses(C)']
): MCMResult {
  // Dimensions array p of size n+1 represents n matrices: Ai has size p[i-1] x p[i]
  const n = dimensions.length - 1;
  const m: number[][] = Array.from({ length: n }, () => Array(n).fill(0));
  const s: number[][] = Array.from({ length: n }, () => Array(n).fill(0));

  // l is the chain length
  for (let l = 2; l <= n; l++) {
    for (let i = 0; i < n - l + 1; i++) {
      const j = i + l - 1;
      m[i][j] = Infinity;
      for (let k = i; k < j; k++) {
        const q = m[i][k] + m[k + 1][j] + dimensions[i] * dimensions[k + 1] * dimensions[j + 1];
        if (q < m[i][j]) {
          m[i][j] = q;
          s[i][j] = k;
        }
      }
    }
  }

  function printOptimal(i: number, j: number): string {
    if (i === j) return tableNames[i] || `A${i + 1}`;
    const k = s[i][j];
    return `(${printOptimal(i, k)} ⨝ ${printOptimal(k + 1, j)})`;
  }

  return {
    dimensions,
    tableNames,
    minMultiplications: m[0][n - 1],
    costMatrix: m,
    bracketMatrix: s,
    optimalParentheses: printOptimal(0, n - 1)
  };
}
