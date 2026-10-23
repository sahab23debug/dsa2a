(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),t.credentials=e.crossOrigin===`use-credentials`?`include`:e.crossOrigin===`anonymous`?`omit`:`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();var e=[{periodNum:1,name:`Period 1`,startTime:`09:10`,endTime:`10:00`,durationMinutes:50,displayStart:`09:10 AM`,displayEnd:`10:00 AM`,isAfternoon:!1},{periodNum:2,name:`Period 2`,startTime:`10:00`,endTime:`10:50`,durationMinutes:50,displayStart:`10:00 AM`,displayEnd:`10:50 AM`,isAfternoon:!1},{periodNum:3,name:`Period 3`,startTime:`10:50`,endTime:`11:40`,durationMinutes:50,displayStart:`10:50 AM`,displayEnd:`11:40 AM`,isAfternoon:!1},{periodNum:4,name:`Period 4`,startTime:`11:40`,endTime:`12:30`,durationMinutes:50,displayStart:`11:40 AM`,displayEnd:`12:30 PM`,isAfternoon:!1},{periodNum:5,name:`Period 5 (Post-Lunch)`,startTime:`13:30`,endTime:`14:30`,durationMinutes:60,displayStart:`01:30 PM`,displayEnd:`02:30 PM`,isAfternoon:!0},{periodNum:6,name:`Period 6`,startTime:`14:30`,endTime:`15:20`,durationMinutes:50,displayStart:`02:30 PM`,displayEnd:`03:20 PM`,isAfternoon:!0},{periodNum:7,name:`Period 7`,startTime:`15:20`,endTime:`16:10`,durationMinutes:50,displayStart:`03:20 PM`,displayEnd:`04:10 PM`,isAfternoon:!0},{periodNum:8,name:`Period 8`,startTime:`16:10`,endTime:`17:00`,durationMinutes:50,displayStart:`04:10 PM`,displayEnd:`05:00 PM`,isAfternoon:!0}];function t(e){let[t,n]=e.split(`:`).map(Number);return(t||0)*60+(n||0)}function n(e,n,r,i){let a=t(e),o=t(n),s=t(r);return a<t(i)&&o>s}var r=[{id:`user-sharma`,name:`Prof. Sharma (User A)`,role:`user`,department:`Dept of Computer Science & Engineering`,avatarInitials:`UA`,badge:`Faculty Member`},{id:`user-verma`,name:`Dr. Verma (User B)`,role:`user`,department:`Dept of Information Technology`,avatarInitials:`UB`,badge:`Faculty Member`},{id:`user-patel`,name:`Sahil Patel (Student Club)`,role:`user`,department:`IEEE & Robotics Society`,avatarInitials:`UC`,badge:`Student Head`},{id:`admin-dean`,name:`Dean Academics (Admin)`,role:`admin`,department:`Campus Facilities & Operations Directorate`,avatarInitials:`AD`,badge:`Campus Admin`}],i=[{id:`b-block-a`,name:`Block A (Main Admin)`,code:`A`,x:130,y:80,width:170,height:90,category:`Academic`},{id:`b-block-b`,name:`Block B (Computing & AI)`,code:`B`,x:130,y:220,width:170,height:90,category:`Laboratory`},{id:`b-block-e`,name:`Block E (Innovation Hub)`,code:`E`,x:130,y:360,width:170,height:90,category:`Innovation`},{id:`b-lawn`,name:`Central Green Lawn`,code:`LAWN`,x:420,y:220,width:190,height:130,category:`Recreation`},{id:`b-hostel-boys`,name:`Boy's Hostel`,code:`BH`,x:100,y:520,width:140,height:90,category:`Residential`,isLocked:!0,lockReason:`Residential dormitory. Academic room reservations are strictly prohibited.`},{id:`b-block-c`,name:`Block C (Core Workshops)`,code:`C`,x:270,y:520,width:140,height:90,category:`Laboratory`,isLocked:!0,lockReason:`Heavy machinery workshops & renovation zone. Block is locked by Dean Directive.`},{id:`b-block-d`,name:`Block D (CSE & IT Core)`,code:`D`,x:440,y:520,width:170,height:90,category:`Academic`},{id:`b-hostel-girls`,name:`Girl's Hostel`,code:`GH`,x:640,y:520,width:140,height:90,category:`Residential`,isLocked:!0,lockReason:`Secure residential zone. Facility reservations are locked for academic users.`}],a=new class{constructor(e,t){this.distMatrix={},this.nextMatrix={},this.executionMetrics={nodesCount:0,iterations:0,timeMs:0},this.buildings=e,this.buildingIds=e.map(e=>e.id),this.runFloydWarshall(t)}runFloydWarshall(e){let t=performance.now(),n=this.buildingIds.length;this.executionMetrics.nodesCount=n;for(let e of this.buildingIds){this.distMatrix[e]={},this.nextMatrix[e]={};for(let t of this.buildingIds)e===t?(this.distMatrix[e][t]=0,this.nextMatrix[e][t]=t):(this.distMatrix[e][t]=999999,this.nextMatrix[e][t]=null)}for(let t of e){let{from:e,to:n,distanceMeters:r}=t;this.distMatrix[e]&&this.distMatrix[n]&&(this.distMatrix[e][n]=r,this.distMatrix[n][e]=r,this.nextMatrix[e][n]=n,this.nextMatrix[n][e]=e)}let r=0;for(let e of this.buildingIds)for(let t of this.buildingIds)for(let n of this.buildingIds){r++;let i=this.distMatrix[t][e]+this.distMatrix[e][n];i<this.distMatrix[t][n]&&(this.distMatrix[t][n]=i,this.nextMatrix[t][n]=this.nextMatrix[t][e])}this.executionMetrics.iterations=r,this.executionMetrics.timeMs=Math.round((performance.now()-t)*100)/100}getDistance(e,t){if(e===t)return 0;let n=this.distMatrix[e]?.[t];return n===void 0||n>=999999?15:n}getShortestPath(e,t){if(e===t)return[e];if(!this.nextMatrix[e]||!this.nextMatrix[e][t])return[e,t];let n=[e],r=e,i=0;for(;r!==t&&i<20;){let e=this.nextMatrix[r]?.[t];if(!e)break;r=e,n.push(r),i++}return n}}(i,[{from:`b-block-a`,to:`b-block-b`,distanceMeters:4},{from:`b-block-b`,to:`b-block-e`,distanceMeters:4},{from:`b-block-a`,to:`b-lawn`,distanceMeters:8},{from:`b-block-b`,to:`b-lawn`,distanceMeters:6},{from:`b-block-e`,to:`b-lawn`,distanceMeters:8},{from:`b-lawn`,to:`b-block-d`,distanceMeters:9},{from:`b-block-e`,to:`b-block-d`,distanceMeters:7},{from:`b-hostel-boys`,to:`b-block-c`,distanceMeters:5},{from:`b-block-c`,to:`b-block-d`,distanceMeters:5},{from:`b-block-d`,to:`b-hostel-girls`,distanceMeters:6}]),o=[{id:`r-d305`,code:`D-305`,name:`Operating Systems & Cloud Lab`,buildingId:`b-block-d`,floor:3,capacity:60,type:`Computer Lab`,hasAC:!0,hasSmartBoard:!0},{id:`r-d101`,code:`D-101`,name:`Alan Turing Lecture Hall`,buildingId:`b-block-d`,floor:1,capacity:140,type:`Lecture Hall`,hasAC:!0,hasSmartBoard:!0},{id:`r-d201`,code:`D-201`,name:`Computer Architecture Classroom`,buildingId:`b-block-d`,floor:2,capacity:80,type:`Lecture Hall`,hasAC:!1,hasSmartBoard:!0},{id:`r-b105`,code:`B-105`,name:`Data Structures Lab`,buildingId:`b-block-b`,floor:1,capacity:60,type:`Computer Lab`,hasAC:!0,hasSmartBoard:!0},{id:`r-b205`,code:`B-205`,name:`Artificial Intelligence Lab`,buildingId:`b-block-b`,floor:2,capacity:60,type:`Computer Lab`,hasAC:!0,hasSmartBoard:!0},{id:`r-b305`,code:`B-305`,name:`Networks & Cybersecurity Lab`,buildingId:`b-block-b`,floor:3,capacity:60,type:`Computer Lab`,hasAC:!0,hasSmartBoard:!1},{id:`r-a101`,code:`A-101`,name:`APJ Abdul Kalam Grand Auditorium`,buildingId:`b-block-a`,floor:1,capacity:320,type:`Auditorium`,hasAC:!0,hasSmartBoard:!0},{id:`r-a201`,code:`A-201`,name:`Executive Council Seminar Hall`,buildingId:`b-block-a`,floor:2,capacity:100,type:`Seminar Room`,hasAC:!0,hasSmartBoard:!0},{id:`r-a301`,code:`A-301`,name:`Foundation Lecture Theatre`,buildingId:`b-block-a`,floor:3,capacity:90,type:`Lecture Hall`,hasAC:!1,hasSmartBoard:!0},{id:`r-e101`,code:`E-101`,name:`Robotics & Drone Systems Lab`,buildingId:`b-block-e`,floor:1,capacity:50,type:`Robotics & IoT Lab`,hasAC:!0,hasSmartBoard:!0},{id:`r-e201`,code:`E-201`,name:`Startup Incubation Arena`,buildingId:`b-block-e`,floor:2,capacity:75,type:`Seminar Room`,hasAC:!0,hasSmartBoard:!0},{id:`r-c101`,code:`C-101`,name:`Heavy Machinery & CNC Workshop`,buildingId:`b-block-c`,floor:1,capacity:60,type:`Laboratory`,hasAC:!1,hasSmartBoard:!1},{id:`r-bh-mess`,code:`BH-COMM`,name:`Boy's Hostel Common Hall`,buildingId:`b-hostel-boys`,floor:1,capacity:150,type:`Hall`,hasAC:!1,hasSmartBoard:!1},{id:`r-gh-mess`,code:`GH-COMM`,name:`Girl's Hostel Activity Center`,buildingId:`b-hostel-girls`,floor:1,capacity:150,type:`Hall`,hasAC:!1,hasSmartBoard:!1}],s=[{id:`p1`,startPeriod:1,endPeriod:1,label:`Period 1 • 09:10 AM - 10:00 AM (50 min)`},{id:`p2`,startPeriod:2,endPeriod:2,label:`Period 2 • 10:00 AM - 10:50 AM (50 min)`},{id:`p3`,startPeriod:3,endPeriod:3,label:`Period 3 • 10:50 AM - 11:40 AM (50 min)`},{id:`p4`,startPeriod:4,endPeriod:4,label:`Period 4 • 11:40 AM - 12:30 PM (50 min)`},{id:`p1-2`,startPeriod:1,endPeriod:2,label:`Period 1 & 2 • 09:10 AM - 10:50 AM (2-Period Lab • 100 min)`},{id:`p3-4`,startPeriod:3,endPeriod:4,label:`Period 3 & 4 • 10:50 AM - 12:30 PM (2-Period Lab • 100 min)`},{id:`morning-half`,startPeriod:1,endPeriod:4,label:`Morning Block • 09:10 AM - 12:30 PM (Periods 1-4 • 200 min)`},{id:`p5`,startPeriod:5,endPeriod:5,label:`Period 5 • 01:30 PM - 02:30 PM (1 Hour Long)`},{id:`p6`,startPeriod:6,endPeriod:6,label:`Period 6 • 02:30 PM - 03:20 PM (50 min)`},{id:`p7`,startPeriod:7,endPeriod:7,label:`Period 7 • 03:20 PM - 04:10 PM (50 min)`},{id:`p8`,startPeriod:8,endPeriod:8,label:`Period 8 • 04:10 PM - 05:00 PM (50 min)`},{id:`p5-6`,startPeriod:5,endPeriod:6,label:`Period 5 & 6 • 01:30 PM - 03:20 PM (2-Period Lab • 110 min)`},{id:`p7-8`,startPeriod:7,endPeriod:8,label:`Period 7 & 8 • 03:20 PM - 05:00 PM (2-Period Lab • 100 min)`},{id:`afternoon-half`,startPeriod:5,endPeriod:8,label:`Afternoon Block • 01:30 PM - 05:00 PM (Periods 5-8 • 210 min)`},{id:`custom`,startPeriod:1,endPeriod:2,label:`⚡ Custom Period Span (Pick Start & End)...`}],c=new class{constructor(){this.currentUser=r[0],this.activeTab=`book`,this.selectedBuildingForMap=`b-block-d`,this.sourceBuildingForMap=`b-block-a`,this.prefilledRoomCode=null,this.showFloydWarshallMatrix=!1,this.selectedBlockForBooking=`b-block-d`,this.selectedClassForBooking=`r-d305`,this.selectedPresetId=`p1-2`,this.selectedStartPeriod=1,this.selectedEndPeriod=2,this.reservations=[{id:`RES-D305-UA`,userId:`user-sharma`,userName:`Prof. Sharma (User A)`,roomId:`r-d305`,roomCode:`D-305`,roomName:`Operating Systems & Cloud Lab`,buildingId:`b-block-d`,buildingName:`Block D (CSE & IT Core)`,floor:3,startPeriodNum:1,endPeriodNum:2,periodSpanLabel:`Period 1 & 2 (09:10 AM - 10:50 AM)`,startTime:`09:10`,endTime:`10:50`,date:`2026-10-23`,title:`Operating Systems Practicum (Batch A1 • 2-Period Lab)`,attendeesCount:55,walkingDistance:a.getDistance(`b-block-a`,`b-block-d`),walkingRoute:a.getShortestPath(`b-block-a`,`b-block-d`),status:`confirmed`}],this.lastConfirmation=null,this.isLoginModalOpen=!1}};function l(e,t,r){if(e!==`auto`)return c.reservations.find(i=>i.roomId===e&&i.status===`confirmed`&&n(i.startTime,i.endTime,t,r))}function u(){let e=document.getElementById(`root`);if(!e)return;let t=c.currentUser.role===`admin`,n=c.reservations.filter(e=>e.userId===c.currentUser.id&&e.status===`confirmed`).length;e.innerHTML=`
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
                ${c.currentUser.avatarInitials}
              </span>
              <span>${c.currentUser.name}</span>
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
            <button data-tab="book" class="nav-tab px-3 py-1.5 rounded-lg font-semibold transition-all ${c.activeTab===`book`?`bg-indigo-600 text-white shadow`:`text-slate-400 hover:text-white`}">
              Book Space
            </button>
            <button data-tab="map" class="nav-tab px-3 py-1.5 rounded-lg font-semibold transition-all ${c.activeTab===`map`?`bg-indigo-600 text-white shadow`:`text-slate-400 hover:text-white`}">
              Campus Map
            </button>
            <button data-tab="schedule" class="nav-tab px-3 py-1.5 rounded-lg font-semibold transition-all ${c.activeTab===`schedule`?`bg-indigo-600 text-white shadow`:`text-slate-400 hover:text-white`}">
              My Bookings ${n>0?`<span class="ml-1 px-1.5 py-0.2 bg-indigo-500/40 text-indigo-200 rounded-full text-[10px]">${n}</span>`:``}
            </button>
            <button data-tab="directory" class="nav-tab px-3 py-1.5 rounded-lg font-semibold transition-all ${c.activeTab===`directory`?`bg-indigo-600 text-white shadow`:`text-slate-400 hover:text-white`}">
              Rooms Directory
            </button>
            ${t?`
              <button data-tab="admin" class="nav-tab px-3 py-1.5 rounded-lg font-semibold transition-all ${c.activeTab===`admin`?`bg-amber-600 text-white shadow`:`text-amber-400 hover:text-amber-200`}">
                Admin Console
              </button>
            `:``}
          </nav>
        </div>
      </header>

      <!-- Main Workspace -->
      <main class="flex-1 max-w-7xl w-full mx-auto px-4 py-6">
        ${d()}
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
            <span class="text-emerald-400">● Live User: ${c.currentUser.name}</span>
            <span class="text-slate-700">|</span>
            <button id="btn-footer-switch" class="text-indigo-400 hover:text-indigo-300 underline font-semibold">
              Switch Account
            </button>
          </div>
        </div>
      </footer>

      <!-- Login / Switch User Modal -->
      ${b()}
    </div>
  `,x()}function d(){switch(c.activeTab){case`book`:return p();case`map`:return g();case`schedule`:return _();case`directory`:return v();case`admin`:return y();default:return p()}}function f(e){if(e===`auto`)return`
      <option value="auto">✨ Any Classroom (Auto-Allocate Closest with Capacity)</option>
      <optgroup label="Block D (CSE & IT Core)">
        <option value="r-d305" ${c.selectedClassForBooking===`r-d305`?`selected`:``}>D-305 — OS & Cloud Lab (Floor 3, 60 Seats)</option>
        <option value="r-d101" ${c.selectedClassForBooking===`r-d101`?`selected`:``}>D-101 — Alan Turing Hall (Floor 1, 140 Seats)</option>
        <option value="r-d201" ${c.selectedClassForBooking===`r-d201`?`selected`:``}>D-201 — CS Architecture Class (Floor 2, 80 Seats)</option>
      </optgroup>
      <optgroup label="Block B (Computing & AI)">
        <option value="r-b105" ${c.selectedClassForBooking===`r-b105`?`selected`:``}>B-105 — Data Structures Lab (Floor 1, 60 Seats)</option>
        <option value="r-b205" ${c.selectedClassForBooking===`r-b205`?`selected`:``}>B-205 — AI Research Lab (Floor 2, 60 Seats)</option>
        <option value="r-b305" ${c.selectedClassForBooking===`r-b305`?`selected`:``}>B-305 — Networks Lab (Floor 3, 60 Seats)</option>
      </optgroup>
      <optgroup label="Block A (Main Admin)">
        <option value="r-a101" ${c.selectedClassForBooking===`r-a101`?`selected`:``}>A-101 — Kalam Grand Auditorium (Floor 1, 320 Seats)</option>
        <option value="r-a201" ${c.selectedClassForBooking===`r-a201`?`selected`:``}>A-201 — Council Seminar Hall (Floor 2, 100 Seats)</option>
        <option value="r-a301" ${c.selectedClassForBooking===`r-a301`?`selected`:``}>A-301 — Foundation Theatre (Floor 3, 90 Seats)</option>
      </optgroup>
      <optgroup label="Block E (Innovation Hub)">
        <option value="r-e101" ${c.selectedClassForBooking===`r-e101`?`selected`:``}>E-101 — Robotics & Drone Lab (Floor 1, 50 Seats)</option>
        <option value="r-e201" ${c.selectedClassForBooking===`r-e201`?`selected`:``}>E-201 — Incubation Arena (Floor 2, 75 Seats)</option>
      </optgroup>
    `;let t=i.find(t=>t.id===e);if(t?.isLocked)return`<option value="" disabled selected>🔒 Block is Locked — No Classrooms Available</option>`;let n=o.filter(t=>t.buildingId===e);return`
    <option value="auto" ${c.selectedClassForBooking===`auto`?`selected`:``}>
      ✨ Auto-Pick Best Room in ${t?.name.split(` (`)[0]||`Block`}
    </option>
    ${n.map(e=>`
      <option value="${e.id}" ${c.selectedClassForBooking===e.id?`selected`:``}>
        ${e.code} — ${e.name} (Floor ${e.floor}, ${e.capacity} Seats)
      </option>
    `).join(``)}
  `}function p(){let t=e.find(e=>e.periodNum===c.selectedStartPeriod)||e[0],n=e.find(e=>e.periodNum===c.selectedEndPeriod)||e[1],r=t.startTime,a=n.endTime,l=i.find(e=>e.id===c.selectedBlockForBooking),u=l?.isLocked,d=c.selectedClassForBooking===`auto`?`r-d305`:c.selectedClassForBooking;return`
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
                    <option value="auto" ${c.selectedBlockForBooking===`auto`?`selected`:``}>✨ Any Block (Auto-Pick Closest)</option>
                    <optgroup label="Academic & Laboratory Blocks (Available)">
                      <option value="b-block-d" ${c.selectedBlockForBooking===`b-block-d`?`selected`:``}>Block D (CSE & IT Core Academic)</option>
                      <option value="b-block-b" ${c.selectedBlockForBooking===`b-block-b`?`selected`:``}>Block B (Computing & AI Laboratories)</option>
                      <option value="b-block-a" ${c.selectedBlockForBooking===`b-block-a`?`selected`:``}>Block A (Main Admin & Kalam Auditorium)</option>
                      <option value="b-block-e" ${c.selectedBlockForBooking===`b-block-e`?`selected`:``}>Block E (Innovation & Incubation Hub)</option>
                    </optgroup>
                    <optgroup label="Restricted / Locked Zones">
                      <option value="b-block-c" ${c.selectedBlockForBooking===`b-block-c`?`selected`:``}>🔒 Block C (Workshops) - Locked</option>
                      <option value="b-hostel-boys" ${c.selectedBlockForBooking===`b-hostel-boys`?`selected`:``}>🔒 Boy's Hostel - Locked</option>
                      <option value="b-hostel-girls" ${c.selectedBlockForBooking===`b-hostel-girls`?`selected`:``}>🔒 Girl's Hostel - Locked</option>
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
                    class="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-indigo-500 text-xs ${u?`opacity-50 cursor-not-allowed`:``}"
                    ${u?`disabled`:``}
                  >
                    ${f(c.selectedBlockForBooking)}
                  </select>
                </div>
              </div>

              <!-- Locked Block Warning if selected -->
              ${u?`
                <div class="p-3 bg-amber-950/70 border border-amber-800/80 rounded-xl text-xs text-amber-200 flex items-start gap-2">
                  <span class="text-sm">🔒</span>
                  <div>
                    <span class="font-bold text-amber-300">${l?.name} is Restricted</span>
                    <p class="text-[11px] text-amber-200/90 mt-0.5">${l?.lockReason}</p>
                  </div>
                </div>
              `:``}
            </div>

            <!-- TIME SPAN SELECTION SECTION -->
            <div class="p-3.5 bg-slate-950/80 rounded-2xl border border-slate-800 space-y-3">
              <div class="flex items-center justify-between">
                <span class="text-xs font-bold text-white flex items-center gap-1.5">
                  <span class="w-2 h-2 rounded-full bg-indigo-400"></span>
                  Booking Time Span:
                </span>
                <span class="text-[11px] font-mono text-indigo-300 font-semibold" id="label-active-span">
                  ${t.periodNum===n.periodNum?`${t.name} (${t.startTime} - ${t.endTime})`:`Periods ${t.periodNum}-${n.periodNum} (${t.startTime} - ${n.endTime})`}
                </span>
              </div>

              <!-- Preset Selectors -->
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label class="block text-slate-400 text-[11px] mb-1">Standard Period / Span Presets:</label>
                  <select id="form-preset-span" class="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500 text-xs">
                    ${s.map(e=>`
                      <option value="${e.id}" ${c.selectedPresetId===e.id?`selected`:``}>
                        ${e.label}
                      </option>
                    `).join(``)}
                  </select>
                </div>

                <!-- Custom Start/End Selectors -->
                <div class="grid grid-cols-2 gap-2">
                  <div>
                    <label class="block text-slate-400 text-[11px] mb-1">Start Period:</label>
                    <select id="form-start-period" class="w-full bg-slate-900 border border-slate-800 rounded-xl px-2.5 py-2 text-white focus:outline-none focus:border-indigo-500 text-xs">
                      ${e.map(e=>`
                        <option value="${e.periodNum}" ${c.selectedStartPeriod===e.periodNum?`selected`:``}>
                          P${e.periodNum} (${e.startTime})
                        </option>
                      `).join(``)}
                    </select>
                  </div>
                  <div>
                    <label class="block text-slate-400 text-[11px] mb-1">End Period:</label>
                    <select id="form-end-period" class="w-full bg-slate-900 border border-slate-800 rounded-xl px-2.5 py-2 text-white focus:outline-none focus:border-indigo-500 text-xs">
                      ${e.map(e=>`
                        <option value="${e.periodNum}" ${c.selectedEndPeriod===e.periodNum?`selected`:``}>
                          P${e.periodNum} (${e.endTime})
                        </option>
                      `).join(``)}
                    </select>
                  </div>
                </div>
              </div>

              <!-- TIMETABLE PERIOD STRIP VISUALIZER -->
              <div class="pt-2 border-t border-slate-800/80 space-y-1.5">
                <div class="flex items-center justify-between text-[10px] text-slate-400">
                  <span>Room Schedule for <strong>${o.find(e=>e.id===d)?.code||`D-305`}</strong> (Click to select period):</span>
                  <span>Lunch Break: 12:30 - 01:30 PM</span>
                </div>

                <div class="grid grid-cols-9 gap-1 text-[10px] select-none">
                  ${m(1,d)}
                  ${m(2,d)}
                  ${m(3,d)}
                  ${m(4,d)}
                  
                  <!-- Lunch Column -->
                  <div class="p-1 rounded-lg bg-slate-900 border border-slate-800 flex flex-col items-center justify-center text-center opacity-70 cursor-not-allowed">
                    <span class="text-[9px] text-amber-400 font-bold leading-none">🥪 LUNCH</span>
                    <span class="text-[8px] text-slate-500 mt-0.5">12:30-1:30</span>
                  </div>

                  ${m(5,d)}
                  ${m(6,d)}
                  ${m(7,d)}
                  ${m(8,d)}
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
              ${h(c.selectedClassForBooking,r,a)}
            </div>

            <!-- Submit Button -->
            <div class="pt-2">
              <button
                id="btn-submit-booking"
                type="submit"
                class="w-full py-3 rounded-xl font-bold text-xs bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30 transition-all cursor-pointer ${u?`opacity-50 cursor-not-allowed bg-slate-800`:``}"
                ${u?`disabled`:``}
              >
                ${u?`🔒 Selected Block is Locked`:`Confirm Reservation for ${c.currentUser.name}`}
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
                ${c.currentUser.avatarInitials}
              </div>
              <div>
                <h4 class="font-bold text-white text-sm">${c.currentUser.name}</h4>
                <p class="text-[11px] text-slate-400">${c.currentUser.department}</p>
              </div>
            </div>
            <div class="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
              <span class="text-slate-400">Role: <strong class="text-slate-200">${c.currentUser.badge}</strong></span>
              <span class="text-emerald-400 font-semibold">Active Session</span>
            </div>
          </div>

          <!-- Last Confirmed Receipt -->
          ${c.lastConfirmation?`
            <div class="bg-slate-900 border border-emerald-900/60 rounded-3xl p-5 shadow-xl space-y-3">
              <div class="flex items-center justify-between pb-2 border-b border-slate-800">
                <span class="text-xs font-bold text-emerald-400 uppercase tracking-wider">● Confirmed Receipt</span>
                <span class="text-[10px] font-mono text-slate-400 bg-slate-950 px-2 py-0.5 rounded">${c.lastConfirmation.id}</span>
              </div>
              <div>
                <h3 class="text-2xl font-black text-white font-mono">${c.lastConfirmation.roomCode}</h3>
                <p class="text-xs font-semibold text-slate-200">${c.lastConfirmation.roomName}</p>
                <p class="text-[11px] text-slate-400">${c.lastConfirmation.buildingName} • Floor ${c.lastConfirmation.floor}</p>
              </div>
              <div class="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-[11px] space-y-1">
                <div class="flex justify-between">
                  <span class="text-slate-400">Span:</span>
                  <span class="font-mono text-indigo-300 font-bold">${c.lastConfirmation.periodSpanLabel}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-slate-400">Time:</span>
                  <span class="font-mono text-white">${c.lastConfirmation.startTime} - ${c.lastConfirmation.endTime}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-slate-400">Floyd-Warshall Route:</span>
                  <span class="font-mono text-emerald-400 font-bold">${c.lastConfirmation.walkingDistance}m (&lt; 1 min)</span>
                </div>
                <div class="text-[10px] text-slate-400 pt-1 border-t border-slate-800">
                  Route: ${c.lastConfirmation.walkingRoute.map(e=>i.find(t=>t.id===e)?.code||e).join(` → `)}
                </div>
              </div>
              <button id="btn-view-receipt-map" class="w-full py-2 bg-indigo-600/80 hover:bg-indigo-600 text-white rounded-xl text-xs font-semibold transition-colors">
                View Walking Route on Map →
              </button>
            </div>
          `:`
            <div class="bg-slate-900/60 border border-slate-800/80 rounded-3xl p-5 text-center text-xs text-slate-400 space-y-2">
              <div class="w-8 h-8 rounded-full bg-slate-800 text-slate-400 mx-auto flex items-center justify-center font-bold">i</div>
              <p>Select your target block, classroom, and period span. Real-time conflict checks will prevent double-bookings.</p>
            </div>
          `}
        </div>
      </div>
    </div>
  `}function m(t,n){let r=e.find(e=>e.periodNum===t);if(!r)return``;let i=l(n,r.startTime,r.endTime),a=t>=c.selectedStartPeriod&&t<=c.selectedEndPeriod;return`
    <button
      type="button"
      class="timeline-period-btn p-1.5 rounded-lg border text-center transition-all flex flex-col items-center justify-center ${i?`bg-rose-950/80 border-rose-700/80 text-rose-300 cursor-pointer`:a?`bg-indigo-600 border-indigo-400 text-white ring-1 ring-indigo-300 font-bold`:`bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-800`}"
      data-period="${t}"
      title="${r.name} (${r.startTime} - ${r.endTime})${i?` - Reserved by ${i.userName}`:` - Available`}"
    >
      <span class="font-bold leading-none">P${t}</span>
      <span class="text-[8px] opacity-80 mt-0.5">${r.startTime}</span>
      ${i?`<span class="text-[7px] text-rose-400 font-bold uppercase mt-0.5">Booked</span>`:``}
    </button>
  `}function h(e,t,n){if(e===`auto`)return``;let r=l(e,t,n);return r?`
      <div class="p-3.5 bg-rose-950/70 border border-rose-700/80 rounded-2xl text-xs text-rose-200 space-y-1">
        <div class="font-bold flex items-center gap-1.5 text-rose-300">
          <span>⚠️ Classroom Already Reserved!</span>
        </div>
        <p class="text-[11px] text-rose-200/90 leading-relaxed">
          ${r.userId===c.currentUser.id?`You already have <strong>${r.roomCode}</strong> reserved during this span (<strong>${r.periodSpanLabel}</strong>).`:`Classroom <strong>${r.roomCode}</strong> is already booked by <strong>${r.userName}</strong> for <strong>${r.periodSpanLabel}</strong>. You cannot double-book this classroom.`}
        </p>
        <p class="text-[10px] text-rose-400 font-medium">
          Please select another classroom in this block, choose another block, or select an open period span.
        </p>
      </div>
    `:``}function g(){let e=i.find(e=>e.id===c.selectedBuildingForMap)||i[0],t=a.getDistance(c.sourceBuildingForMap,c.selectedBuildingForMap),n=a.getShortestPath(c.sourceBuildingForMap,c.selectedBuildingForMap),r=n.map(e=>i.find(t=>t.id===e)?.name.split(` (`)[0]||e),s=o.filter(t=>t.buildingId===e.id),l=n.map(e=>{let t=i.find(t=>t.id===e);return t?{x:t.x+t.width/2,y:t.y+t.height/2}:{x:0,y:0}});return`
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
              <option value="b-block-a" ${c.sourceBuildingForMap===`b-block-a`?`selected`:``}>Block A</option>
              <option value="b-block-b" ${c.sourceBuildingForMap===`b-block-b`?`selected`:``}>Block B</option>
              <option value="b-block-e" ${c.sourceBuildingForMap===`b-block-e`?`selected`:``}>Block E</option>
              <option value="b-block-d" ${c.sourceBuildingForMap===`b-block-d`?`selected`:``}>Block D</option>
            </select>

            <span class="text-slate-400 px-1">To:</span>
            <select id="map-select-target" class="bg-slate-900 border-none rounded-lg px-2 py-1 text-white text-xs">
              ${i.map(e=>`
                <option value="${e.id}" ${c.selectedBuildingForMap===e.id?`selected`:``}>
                  ${e.name} ${e.isLocked?`[Locked]`:``}
                </option>
              `).join(``)}
            </select>
          </div>

          <button id="btn-toggle-fw-matrix" class="px-3 py-1.5 rounded-xl font-semibold text-xs border ${c.showFloydWarshallMatrix?`bg-indigo-600 text-white border-indigo-500`:`bg-slate-800 text-slate-200 border-slate-700 hover:bg-slate-700`} transition-all">
            📊 ${c.showFloydWarshallMatrix?`Hide`:`View`} Floyd-Warshall Matrix
          </button>
        </div>
      </div>

      <!-- Collapsible Floyd-Warshall All-Pairs Distance Matrix Table -->
      ${c.showFloydWarshallMatrix?`
        <div class="bg-slate-900 border border-indigo-900/60 rounded-3xl p-5 shadow-2xl space-y-3 animate-in fade-in">
          <div class="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-slate-800">
            <div>
              <h3 class="text-sm font-bold text-white flex items-center gap-2">
                <span>Floyd-Warshall All-Pairs Shortest Path Matrix D[V][V]</span>
                <span class="text-[10px] bg-indigo-950 text-indigo-300 px-2 py-0.5 rounded border border-indigo-800 font-mono">
                  ${a.executionMetrics.iterations} operations (${a.executionMetrics.timeMs}ms)
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
                  ${i.map(e=>`<th class="p-2 ${e.isLocked?`text-amber-400`:`text-slate-300`}">${e.code}</th>`).join(``)}
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-800/60">
                ${i.map(e=>`
                  <tr class="hover:bg-slate-800/40 transition-colors">
                    <td class="p-2 text-left font-sans font-semibold text-slate-300 text-[11px]">
                      ${e.name.split(` (`)[0]} ${e.isLocked?`🔒`:``}
                    </td>
                    ${i.map(t=>{let n=a.getDistance(e.id,t.id),r=e.id===t.id;return`
                        <td 
                          class="p-2 cursor-pointer transition-all ${c.sourceBuildingForMap===e.id&&c.selectedBuildingForMap===t.id?`bg-indigo-600/40 text-white font-bold ring-1 ring-indigo-400 rounded`:r?`text-slate-600`:n>=999999?`text-rose-500`:`text-indigo-300 hover:bg-indigo-950 hover:text-white`} matrix-cell"
                          data-from="${e.id}"
                          data-to="${t.id}"
                          title="Route from ${e.name} to ${t.name}: ${n>=999999?`Unreachable`:`${n} meters`}"
                        >
                          ${r?`0m`:n>=999999?`∞`:`${n}m`}
                        </td>
                      `}).join(``)}
                  </tr>
                `).join(``)}
              </tbody>
            </table>
          </div>
        </div>
      `:``}

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
              ${l.length>1?`
                <g stroke="url(#routeGradient)" stroke-width="5" stroke-linecap="round" stroke-linejoin="round">
                  ${l.map((e,t)=>{if(t===0)return``;let n=l[t-1];return`<line x1="${n.x}" y1="${n.y}" x2="${e.x}" y2="${e.y}" />`}).join(``)}
                </g>
                ${l.map((e,t)=>`
                  <circle cx="${e.x}" cy="${e.y}" r="6" fill="${t===0?`#10b981`:t===l.length-1?`#6366f1`:`#38bdf8`}" stroke="#ffffff" stroke-width="2" />
                `).join(``)}
              `:``}

              <!-- Buildings -->
              ${i.map(e=>{let t=e.id===c.selectedBuildingForMap,r=e.id===c.sourceBuildingForMap,i=n.includes(e.id);return`
                  <g class="cursor-pointer group building-rect" data-building-id="${e.id}">
                    <rect
                      x="${e.x}"
                      y="${e.y}"
                      width="${e.width}"
                      height="${e.height}"
                      rx="14"
                      fill="${e.isLocked?`#2a1208`:t?`#1e1b4b`:r?`#064e3b`:i?`#1e293b`:`#0f172a`}"
                      stroke="${e.isLocked?`#b45309`:t?`#6366f1`:r?`#10b981`:i?`#38bdf8`:`#334155`}"
                      stroke-width="${t||r?`3`:i?`2`:`1.5`}"
                    />
                    <text
                      x="${e.x+e.width/2}"
                      y="${e.y+(e.isLocked?38:45)}"
                      textAnchor="middle"
                      fill="${e.isLocked?`#f59e0b`:`#ffffff`}"
                      font-size="12"
                      font-weight="bold"
                    >
                      ${e.name}
                    </text>
                    ${e.isLocked?`
                      <text x="${e.x+e.width/2}" y="${e.y+60}" textAnchor="middle" fill="#fcd34d" font-size="10" font-weight="bold">
                        🔒 LOCKED
                      </text>
                    `:`
                      <text x="${e.x+e.width/2}" y="${e.y+65}" textAnchor="middle" fill="#94a3b8" font-size="10">
                        ${e.code} • ${e.category}
                      </text>
                    `}
                  </g>
                `}).join(``)}
            </svg>
          </div>

          <!-- Bottom Route Summary from Floyd-Warshall -->
          <div class="mt-3 p-3 bg-slate-950/80 rounded-2xl border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs">
            <div>
              <span class="text-slate-400">Floyd-Warshall Shortest Route:</span>
              <strong class="text-indigo-300 font-mono ml-1">
                ${r.join(` → `)}
              </strong>
            </div>
            <div class="flex items-center gap-3">
              <span class="text-emerald-400 font-mono font-bold">${t}m (&lt; 1 min walk)</span>
              <span class="text-slate-600">|</span>
              <span class="text-slate-400 text-[11px]">Scaled 1:20</span>
            </div>
          </div>
        </div>

        <!-- Sidebar Facility Details (4 cols) -->
        <div class="lg:col-span-4 bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4">
          <div class="pb-3 border-b border-slate-800">
            <div class="flex items-center justify-between">
              <h3 class="font-bold text-white text-base">${e.name}</h3>
              <span class="text-xs px-2 py-0.5 rounded-full font-mono font-bold ${e.isLocked?`bg-amber-950 text-amber-300 border border-amber-800`:`bg-indigo-950 text-indigo-300 border border-indigo-800`}">
                ${e.code}
              </span>
            </div>
            <p class="text-xs text-slate-400 mt-1">${e.category} Block</p>
          </div>

          ${e.isLocked?`
            <div class="p-3.5 bg-amber-950/60 border border-amber-800/80 rounded-2xl text-xs text-amber-200 space-y-1.5">
              <div class="font-bold text-amber-300">🔒 Access Restricted / Facility Locked</div>
              <p class="text-[11px] leading-relaxed text-amber-200/90">${e.lockReason}</p>
              <p class="text-[10px] text-amber-400 font-semibold">Automated bookings are strictly prohibited for this block.</p>
            </div>
          `:`
            <div class="space-y-3">
              <span class="text-xs font-semibold text-slate-400 block">Facilities in this Block:</span>
              <div class="space-y-2">
                ${s.map(e=>{let t=c.reservations.find(t=>t.roomId===e.id&&t.status===`confirmed`);return`
                    <div class="p-3 rounded-2xl bg-slate-950 border ${t?`border-amber-800/60 bg-amber-950/10`:`border-slate-800`} flex items-center justify-between text-xs">
                      <div>
                        <div class="font-bold text-white font-mono flex items-center gap-1.5">
                          <span>${e.code}</span>
                          ${t?`<span class="text-[9px] bg-amber-950 text-amber-300 px-1.5 py-0.2 rounded border border-amber-700">Reserved</span>`:``}
                        </div>
                        <div class="text-[11px] text-slate-300 truncate max-w-[140px]">${e.name}</div>
                        <div class="text-[10px] text-slate-500 mt-0.5">${e.capacity} seats • Floor ${e.floor}</div>
                        ${t?`
                          <div class="text-[10px] text-amber-300 mt-0.5">
                            ${t.periodSpanLabel} (${t.userName.replace(/ \(User [AB]\)/,``)})
                          </div>
                        `:``}
                      </div>

                      <div>
                        <button class="btn-book-room-code px-2.5 py-1 ${t?`bg-amber-900/40 text-amber-300 border border-amber-700`:`bg-indigo-600 hover:bg-indigo-500 text-white`} rounded-lg text-[10px] font-semibold" data-code="${e.code}">
                          ${t?`View`:`Book`}
                        </button>
                      </div>
                    </div>
                  `}).join(``)}
              </div>
            </div>
          `}
        </div>
      </div>
    </div>
  `}function _(){let e=c.currentUser.role===`admin`,t=c.reservations.filter(e=>e.userId===c.currentUser.id&&e.status===`confirmed`),n=c.reservations.filter(e=>e.status===`confirmed`),r=e?n:t;return`
    <div class="space-y-6 max-w-5xl mx-auto pb-12">
      <div class="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-lg flex flex-wrap items-center justify-between gap-4">
        <div>
          <div class="flex items-center gap-2">
            <h2 class="text-lg font-bold text-white">
              ${e?`Central Campus Schedule (All Bookings)`:`My Confirmed Bookings (${c.currentUser.name})`}
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
      ${r.length>0?`
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          ${r.map(t=>{let n=t.userId===c.currentUser.id;return`
              <div class="bg-slate-900 border ${n?`border-indigo-900/60`:`border-slate-800`} rounded-3xl p-5 shadow-lg space-y-4">
                <div class="flex items-center justify-between pb-3 border-b border-slate-800">
                  <span class="text-xs font-bold text-emerald-400">● Confirmed Reservation</span>
                  <div class="flex items-center gap-2">
                    <span class="text-[10px] px-2 py-0.5 rounded-full ${n?`bg-indigo-950 text-indigo-300 border border-indigo-800`:`bg-amber-950 text-amber-300 border border-amber-800`} font-semibold">
                      ${n?`Booked by You`:`Booked by ${t.userName}`}
                    </span>
                    <span class="text-xs font-mono text-slate-400 bg-slate-950 px-2 py-0.5 rounded">${t.id}</span>
                  </div>
                </div>

                <div>
                  <div class="flex items-baseline justify-between">
                    <h3 class="text-2xl font-black text-white font-mono">${t.roomCode}</h3>
                    <span class="text-xs font-semibold text-indigo-300 bg-indigo-950 px-2.5 py-0.5 rounded-full">Floor ${t.floor}</span>
                  </div>
                  <div class="text-sm font-semibold text-slate-200 mt-0.5">${t.roomName}</div>
                  <div class="text-xs text-slate-400 mt-1">${t.buildingName}</div>
                </div>

                <div class="p-3 bg-slate-950 rounded-2xl border border-slate-800 text-xs space-y-1">
                  <div class="font-semibold text-white truncate">${t.title}</div>
                  <div class="flex justify-between text-slate-400 text-[11px]">
                    <span>Period: <strong class="text-indigo-300 font-mono">${t.periodSpanLabel}</strong></span>
                    <span>Distance: <strong class="text-emerald-400">${t.walkingDistance}m</strong></span>
                  </div>
                  <div class="flex justify-between text-slate-400 text-[10px] pt-1 border-t border-slate-800/80">
                    <span>Time Window: <strong class="text-white">${t.startTime} - ${t.endTime}</strong></span>
                    <span>Date: ${t.date}</span>
                  </div>
                </div>

                <div class="pt-2 border-t border-slate-800 flex items-center justify-between gap-2">
                  <button class="btn-goto-map flex-1 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold" data-bldg="${t.buildingId}">
                    View Map Route
                  </button>
                  ${n||e?`
                    <button class="btn-cancel-reservation px-3 py-2 bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 border border-rose-800/60 rounded-xl text-xs font-semibold" data-id="${t.id}">
                      ${e&&!n?`Admin Release`:`Cancel Slot`}
                    </button>
                  `:``}
                </div>
              </div>
            `}).join(``)}
        </div>
      `:`
        <div class="bg-slate-900 border border-slate-800 rounded-3xl p-10 text-center space-y-3">
          <h3 class="text-base font-bold text-white">No Active Bookings for ${c.currentUser.name}</h3>
          <p class="text-xs text-slate-400 max-w-sm mx-auto">
            You currently have no reserved spaces. Go to the booking tab to reserve any of the 8 academic periods.
          </p>
        </div>
      `}
    </div>
  `}function v(){return`
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
        ${o.map(t=>{let r=i.find(e=>e.id===t.buildingId),a=r?.isLocked,o=c.reservations.filter(e=>e.roomId===t.id&&e.status===`confirmed`);return`
            <div class="bg-slate-900 border ${a?`border-amber-900/40 bg-amber-950/10`:o.length>0?`border-indigo-800/60`:`border-slate-800`} rounded-3xl p-5 shadow-lg flex flex-col justify-between space-y-4">
              <div class="space-y-2">
                <div class="flex items-center justify-between">
                  <span class="text-lg font-black text-white font-mono">${t.code}</span>
                  ${a?`
                    <span class="text-[10px] font-semibold text-amber-400 bg-amber-950 border border-amber-800 px-2 py-0.5 rounded-full">
                      🔒 Locked Facility
                    </span>
                  `:o.length>0?`
                    <span class="text-[10px] font-semibold text-amber-300 bg-amber-950 border border-amber-800 px-2 py-0.5 rounded-full">
                      ${o.length} Active Booking${o.length>1?`s`:``}
                    </span>
                  `:`
                    <span class="text-[10px] font-semibold text-emerald-400 bg-emerald-950 border border-emerald-800 px-2 py-0.5 rounded-full">
                      All Periods Free
                    </span>
                  `}
                </div>

                <div>
                  <h4 class="text-sm font-semibold text-slate-200">${t.name}</h4>
                  <p class="text-xs text-slate-400">${r?.name} • Floor ${t.floor}</p>
                </div>

                <div class="flex items-center gap-2 text-xs">
                  <span class="px-2.5 py-1 rounded-xl bg-slate-950 text-indigo-300 border border-slate-800 font-mono font-bold">${t.capacity} Seats</span>
                  <span class="px-2.5 py-1 rounded-xl bg-slate-950 text-slate-400 border border-slate-800">${t.type}</span>
                </div>

                <!-- Mini Timeline of Periods for this Room -->
                ${a?``:`
                  <div class="pt-2 border-t border-slate-800/60 space-y-1">
                    <span class="text-[10px] text-slate-400 block">Daily Period Occupancy:</span>
                    <div class="grid grid-cols-8 gap-0.5 text-center text-[9px] font-mono">
                      ${e.map(e=>{let t=o.some(t=>n(t.startTime,t.endTime,e.startTime,e.endTime));return`
                          <div class="p-1 rounded ${t?`bg-rose-950 text-rose-300 border border-rose-800 font-bold`:`bg-slate-950 text-slate-400 border border-slate-800`}" title="${e.name} (${e.startTime}-${e.endTime}): ${t?`Booked`:`Free`}">
                            P${e.periodNum}
                          </div>
                        `}).join(``)}
                    </div>
                  </div>
                `}
              </div>

              <div class="pt-3 border-t border-slate-800">
                ${a?`
                  <button disabled class="w-full py-2 bg-amber-950/40 border border-amber-800/40 text-amber-400/80 font-medium text-xs rounded-xl cursor-not-allowed">
                    🔒 Facility Locked
                  </button>
                `:`
                  <button class="btn-book-room-code w-full py-2 bg-indigo-600/80 hover:bg-indigo-600 text-white font-semibold text-xs rounded-xl transition-colors" data-code="${t.code}">
                    Book This Space →
                  </button>
                `}
              </div>
            </div>
          `}).join(``)}
      </div>
    </div>
  `}function y(){return`
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
          <span class="font-bold text-white">System Reservations (${c.reservations.length} Active)</span>
          <span class="text-slate-400">Zero Double-Bookings Enforced</span>
        </div>

        <div class="divide-y divide-slate-800 text-xs">
          ${c.reservations.map(e=>`
            <div class="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <div class="flex items-center gap-2">
                  <span class="font-bold text-white font-mono text-sm">${e.roomCode}</span>
                  <span class="text-[10px] px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-slate-300">${e.buildingName}</span>
                  <span class="text-[10px] px-2 py-0.5 rounded bg-indigo-950 border border-indigo-800 text-indigo-300 font-semibold">${e.userName}</span>
                </div>
                <p class="text-slate-300 text-xs mt-1">
                  ${e.title} • Span: <strong class="text-indigo-300">${e.periodSpanLabel}</strong> (${e.startTime} - ${e.endTime})
                </p>
              </div>

              <button class="btn-cancel-reservation px-3 py-1.5 bg-rose-950 text-rose-300 border border-rose-800 rounded-lg font-semibold hover:bg-rose-900/80 transition-colors" data-id="${e.id}">
                Admin Release Slot
              </button>
            </div>
          `).join(``)}
        </div>
      </div>
    </div>
  `}function b(){return c.isLoginModalOpen?`
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
          ${r.map(e=>`
            <button
              class="btn-select-user w-full p-3 rounded-2xl border text-left flex items-center justify-between transition-all ${c.currentUser.id===e.id?`bg-indigo-600/20 border-indigo-500 text-white ring-1 ring-indigo-500/50`:`bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700`}"
              data-user-id="${e.id}"
            >
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-xl bg-slate-800 text-indigo-300 border border-slate-700 flex items-center justify-center font-bold text-xs">
                  ${e.avatarInitials}
                </div>
                <div>
                  <div class="font-bold text-white text-xs">${e.name}</div>
                  <div class="text-[11px] text-slate-400">${e.department}</div>
                </div>
              </div>
              <span class="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">${e.badge}</span>
            </button>
          `).join(``)}
        </div>
      </div>
    </div>
  `:``}function x(){document.querySelectorAll(`.nav-tab`).forEach(e=>{e.addEventListener(`click`,e=>{let t=e.currentTarget.dataset.tab;t&&(c.activeTab=t,u())})});let t=document.getElementById(`btn-open-user-modal`);t&&t.addEventListener(`click`,()=>{c.isLoginModalOpen=!0,u()});let n=document.getElementById(`btn-footer-switch`);n&&n.addEventListener(`click`,()=>{c.isLoginModalOpen=!0,u()});let d=document.getElementById(`btn-close-modal`);d&&d.addEventListener(`click`,()=>{c.isLoginModalOpen=!1,u()}),document.querySelectorAll(`.btn-select-user`).forEach(e=>{e.addEventListener(`click`,e=>{let t=e.currentTarget.dataset.userId,n=r.find(e=>e.id===t);n&&(c.currentUser=n,c.isLoginModalOpen=!1,n.role===`admin`&&(c.activeTab=`admin`),u())})});let f=document.getElementById(`btn-toggle-fw-matrix`);f&&f.addEventListener(`click`,()=>{c.showFloydWarshallMatrix=!c.showFloydWarshallMatrix,u()}),document.querySelectorAll(`.matrix-cell`).forEach(e=>{e.addEventListener(`click`,e=>{let t=e.currentTarget.dataset.from,n=e.currentTarget.dataset.to;t&&n&&(c.sourceBuildingForMap=t,c.selectedBuildingForMap=n,u())})}),document.querySelectorAll(`.timeline-period-btn`).forEach(e=>{e.addEventListener(`click`,e=>{let t=Number(e.currentTarget.dataset.period);t&&(c.selectedPresetId=`custom`,c.selectedStartPeriod=t,c.selectedEndPeriod=t,u())})});let p=document.getElementById(`form-block`);p&&p.addEventListener(`change`,e=>{let t=e.target.value;if(c.selectedBlockForBooking=t,t===`auto`)c.selectedClassForBooking=`auto`;else{let e=o.filter(e=>e.buildingId===t);c.selectedClassForBooking=e.length>0?e[0].id:`auto`}u()});let m=document.getElementById(`form-class`);m&&m.addEventListener(`change`,e=>{c.selectedClassForBooking=e.target.value,u()});let h=document.getElementById(`form-preset-span`);h&&h.addEventListener(`change`,e=>{let t=e.target.value;c.selectedPresetId=t;let n=s.find(e=>e.id===t);n&&t!==`custom`&&(c.selectedStartPeriod=n.startPeriod,c.selectedEndPeriod=n.endPeriod),u()});let g=document.getElementById(`form-start-period`);g&&g.addEventListener(`change`,e=>{let t=Number(e.target.value);c.selectedStartPeriod=t,c.selectedEndPeriod<t&&(c.selectedEndPeriod=t),c.selectedPresetId=`custom`,u()});let _=document.getElementById(`form-end-period`);_&&_.addEventListener(`change`,e=>{let t=Number(e.target.value);c.selectedEndPeriod=Math.max(t,c.selectedStartPeriod),c.selectedPresetId=`custom`,u()});let v=document.getElementById(`booking-form`);v&&v.addEventListener(`submit`,t=>{t.preventDefault();let n=document.getElementById(`form-title`).value,r=Number(document.getElementById(`form-attendees`).value),s=document.getElementById(`form-origin`).value,d=c.selectedBlockForBooking,f=c.selectedClassForBooking,p=i.find(e=>e.id===d);if(p?.isLocked){alert(`${p.name} is currently locked. Room booking is disabled.`);return}let m=e.find(e=>e.periodNum===c.selectedStartPeriod)||e[0],h=e.find(e=>e.periodNum===c.selectedEndPeriod)||e[1],g=m.startTime,_=h.endTime,v=m.periodNum===h.periodNum?`${m.name} (${m.startTime} - ${m.endTime})`:`Periods ${m.periodNum}-${h.periodNum} (${m.startTime} - ${h.endTime})`,y;if(f===`auto`){let e=o.filter(e=>d!==`auto`&&e.buildingId!==d||i.find(t=>t.id===e.buildingId)?.isLocked||e.capacity<r?!1:!l(e.id,g,_));if(e.length===0){alert(`No facilities available matching this capacity without conflicts in this period span. Try another period or block.`);return}e.sort((e,t)=>a.getDistance(s,e.buildingId)-a.getDistance(s,t.buildingId)),y=e[0]}else y=o.find(e=>e.id===f);if(!y){alert(`Invalid classroom selected`);return}let b=i.find(e=>e.id===y.buildingId),x=a.getDistance(s,y.buildingId),S=a.getShortestPath(s,y.buildingId),C={id:`RES-${Date.now().toString().slice(-4)}`,userId:c.currentUser.id,userName:c.currentUser.name,roomId:y.id,roomCode:y.code,roomName:y.name,buildingId:y.buildingId,buildingName:b?.name||`Academic Block`,floor:y.floor,startPeriodNum:m.periodNum,endPeriodNum:h.periodNum,periodSpanLabel:v,startTime:g,endTime:_,date:`2026-10-23`,title:n||`Scheduled Academic Session`,attendeesCount:r,walkingDistance:x,walkingRoute:S,status:`confirmed`};c.reservations.unshift(C),c.lastConfirmation=C,c.prefilledRoomCode=null,u()}),document.querySelectorAll(`.btn-cancel-reservation`).forEach(e=>{e.addEventListener(`click`,e=>{let t=e.currentTarget.dataset.id;t&&(c.reservations=c.reservations.filter(e=>e.id!==t),c.lastConfirmation?.id===t&&(c.lastConfirmation=null),u())})}),document.querySelectorAll(`.building-rect`).forEach(e=>{e.addEventListener(`click`,e=>{let t=e.currentTarget.dataset.buildingId;t&&(c.selectedBuildingForMap=t,u())})});let y=document.getElementById(`map-select-source`);y&&y.addEventListener(`change`,e=>{c.sourceBuildingForMap=e.target.value,u()});let b=document.getElementById(`map-select-target`);b&&b.addEventListener(`change`,e=>{c.selectedBuildingForMap=e.target.value,u()}),document.querySelectorAll(`.btn-book-room-code`).forEach(e=>{e.addEventListener(`click`,e=>{let t=e.currentTarget.dataset.code;if(t){c.prefilledRoomCode=t;let e=o.find(e=>e.code===t);e&&(c.selectedBlockForBooking=e.buildingId,c.selectedClassForBooking=e.id),c.activeTab=`book`,u()}})}),document.querySelectorAll(`.btn-goto-map`).forEach(e=>{e.addEventListener(`click`,e=>{let t=e.currentTarget.dataset.bldg;t&&(c.selectedBuildingForMap=t,c.activeTab=`map`,u())})});let x=document.getElementById(`btn-view-receipt-map`);x&&x.addEventListener(`click`,()=>{c.lastConfirmation&&(c.selectedBuildingForMap=c.lastConfirmation.buildingId,c.activeTab=`map`,u())});let S=document.getElementById(`btn-schedule-book-another`);S&&S.addEventListener(`click`,()=>{c.activeTab=`book`,u()})}document.addEventListener(`DOMContentLoaded`,()=>{u()}),(document.readyState===`complete`||document.readyState===`interactive`)&&u();