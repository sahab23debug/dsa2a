/**
 * Unit 4: Backtracking and Branch & Bound Algorithms Implementation
 * Based on NIET PBL Final Report: Intelligent Campus Resource Optimization System
 * Topics: Graph Colouring (Time-Slot Conflict Prevention),
 * Travelling Salesman Problem (Campus Maintenance Round via Branch & Bound),
 * n-Queens Problem (Non-Interfering Wi-Fi Router Placement),
 * Sum of Subsets (Combining Student Groups to Match Exact Room Capacity).
 */

// ==========================================
// 1. Graph Colouring (Time-Slot Conflict Prevention)
// ==========================================
export interface ConflictLectureNode {
  id: string;
  code: string;
  name: string;
  faculty: string;
}

export interface GraphColoringResult {
  isSolvable: boolean;
  colorsAssigned: Record<string, number>;
  slotNames: string[];
  chromaticNumber: number;
  conflictsChecked: number;
  steps: string[];
}

export function solveGraphColoringTimeSlots(
  numSlots: number = 4
): GraphColoringResult {
  const lectures: ConflictLectureNode[] = [
    { id: 'L1', code: 'CSE301', name: 'Operating Systems (Batch A)', faculty: 'Prof. Sharma' },
    { id: 'L2', code: 'IT205', name: 'Data Structures (Batch A/B)', faculty: 'Dr. Verma' },
    { id: 'L3', code: 'ECE102', name: 'Digital Logic (Batch A)', faculty: 'Dr. Gupta' },
    { id: 'L4', code: 'AI401', name: 'Machine Learning (Batch B)', faculty: 'Dr. Rao' },
    { id: 'L5', code: 'CS305', name: 'Cloud Computing (Batch A/B)', faculty: 'Prof. Sharma' },
    { id: 'L6', code: 'ROB201', name: 'Robotics Sensors', faculty: 'Prof. Singh' }
  ];

  // Adjacency matrix of conflicts (shares students or faculty)
  // L1 shares batch with L2, L3, L5
  const conflictAdj: number[][] = [
    // L1 L2 L3 L4 L5 L6
    [0, 1, 1, 0, 1, 0], // L1 (OS)
    [1, 0, 0, 1, 1, 0], // L2 (DS)
    [1, 0, 0, 0, 1, 0], // L3 (Digital Logic)
    [0, 1, 0, 0, 1, 1], // L4 (ML)
    [1, 1, 1, 1, 0, 0], // L5 (Cloud)
    [0, 0, 0, 1, 0, 0]  // L6 (Robotics)
  ];

  const n = lectures.length;
  const color: number[] = Array(n).fill(0);
  const steps: string[] = [];
  let checks = 0;

  function isSafe(v: number, c: number): boolean {
    checks++;
    for (let i = 0; i < n; i++) {
      if (conflictAdj[v][i] === 1 && color[i] === c) {
        return false;
      }
    }
    return true;
  }

  function graphColoringUtil(v: number): boolean {
    if (v === n) return true;

    for (let c = 1; c <= numSlots; c++) {
      if (isSafe(v, c)) {
        color[v] = c;
        steps.push(`Assigned Slot #${c} to ${lectures[v].code} (${lectures[v].name})`);
        if (graphColoringUtil(v + 1)) return true;
        // Backtrack
        color[v] = 0;
        steps.push(`Backtracked from ${lectures[v].code} with Slot #${c}`);
      }
    }
    return false;
  }

  const isSolvable = graphColoringUtil(0);
  const slotLabels = [
    'Slot 1: 09:00 - 10:30',
    'Slot 2: 10:30 - 12:00',
    'Slot 3: 13:00 - 14:30',
    'Slot 4: 14:30 - 16:00'
  ];

  const colorsAssigned: Record<string, number> = {};
  let maxColorUsed = 0;
  lectures.forEach((lec, idx) => {
    colorsAssigned[lec.id] = color[idx];
    if (color[idx] > maxColorUsed) maxColorUsed = color[idx];
  });

  return {
    isSolvable,
    colorsAssigned,
    slotNames: slotLabels,
    chromaticNumber: maxColorUsed,
    conflictsChecked: checks,
    steps
  };
}

// ==========================================
// 2. Travelling Salesman Problem (TSP & Hamiltonian Cycle)
// Campus Maintenance / Security Rounds via Branch & Bound
// ==========================================
export interface TSPResult {
  bestRoute: string[];
  minCost: number; // in meters (divided by 20)
  nodes: string[];
  nodesVisitedCount: number;
  steps: string[];
}

export function solveCampusMaintenanceTSP(): TSPResult {
  // Campus active nodes: A, B, E, Lawn, D
  const nodes = ['A', 'B', 'E', 'LAWN', 'D'];
  const n = nodes.length;

  // Inter-block scaled distance matrix (/20)
  const dist: number[][] = [
    // A   B   E  LAWN  D
    [0, 4, 8, 8, 11],   // A
    [4, 0, 4, 6, 8],    // B
    [8, 4, 0, 8, 7],    // E
    [8, 6, 8, 0, 9],    // LAWN
    [11, 8, 7, 9, 0]    // D
  ];

  let minCost = Infinity;
  let bestPath: number[] = [];
  const steps: string[] = [];
  let evaluatedStates = 0;

  // Branch & Bound with Lower Bound estimation
  function calculateBound(currPath: number[], visited: boolean[]): number {
    let bound = 0;
    // Current path edges
    for (let i = 0; i < currPath.length - 1; i++) {
      bound += dist[currPath[i]][currPath[i + 1]];
    }

    // Min outgoing edges for unvisited vertices
    for (let i = 0; i < n; i++) {
      if (!visited[i] || i === currPath[currPath.length - 1]) {
        let minEdge = Infinity;
        for (let j = 0; j < n; j++) {
          if (i !== j && dist[i][j] < minEdge) {
            minEdge = dist[i][j];
          }
        }
        bound += minEdge;
      }
    }
    return bound;
  }

  function tspBranchAndBound(currPath: number[], visited: boolean[], currentCost: number) {
    evaluatedStates++;
    if (currPath.length === n) {
      const returnCost = dist[currPath[currPath.length - 1]][currPath[0]];
      const totalCost = currentCost + returnCost;
      if (totalCost < minCost) {
        minCost = totalCost;
        bestPath = [...currPath, currPath[0]];
        steps.push(`Found new optimal Hamiltonian tour: ${bestPath.map(i => nodes[i]).join(' → ')} (Total: ${minCost}m)`);
      }
      return;
    }

    for (let next = 0; next < n; next++) {
      if (!visited[next]) {
        const newCost = currentCost + dist[currPath[currPath.length - 1]][next];
        visited[next] = true;
        currPath.push(next);

        const bound = calculateBound(currPath, visited);
        if (bound < minCost) {
          tspBranchAndBound(currPath, visited, newCost);
        } else {
          // Pruned branch
        }

        currPath.pop();
        visited[next] = false;
      }
    }
  }

  const visited = Array(n).fill(false);
  visited[0] = true;
  tspBranchAndBound([0], visited, 0);

  return {
    bestRoute: bestPath.map(i => nodes[i]),
    minCost,
    nodes,
    nodesVisitedCount: evaluatedStates,
    steps
  };
}

// ==========================================
// 3. n-Queens Problem (Wi-Fi Router Signal Placement)
// ==========================================
export interface NQueensResult {
  n: number;
  board: number[][]; // 1 = router, 0 = empty
  queenPositions: { row: number; col: number }[];
  stepsCount: number;
  isSolvable: boolean;
}

export function solveNQueensRouterPlacement(n: number = 6): NQueensResult {
  const board: number[][] = Array.from({ length: n }, () => Array(n).fill(0));
  let steps = 0;

  function isSafe(row: number, col: number): boolean {
    steps++;
    // Check row on left
    for (let i = 0; i < col; i++) {
      if (board[row][i] === 1) return false;
    }
    // Check upper diagonal on left
    for (let i = row, j = col; i >= 0 && j >= 0; i--, j--) {
      if (board[i][j] === 1) return false;
    }
    // Check lower diagonal on left
    for (let i = row, j = col; j >= 0 && i < n; i++, j--) {
      if (board[i][j] === 1) return false;
    }
    return true;
  }

  function solve(col: number): boolean {
    if (col >= n) return true;

    for (let i = 0; i < n; i++) {
      if (isSafe(i, col)) {
        board[i][col] = 1;
        if (solve(col + 1)) return true;
        // Backtrack
        board[i][col] = 0;
      }
    }
    return false;
  }

  const isSolvable = solve(0);
  const positions: { row: number; col: number }[] = [];

  for (let r = 0; r < n; r++) {
    for (let c = 0; c < n; c++) {
      if (board[r][c] === 1) {
        positions.push({ row: r, col: c });
      }
    }
  }

  return {
    n,
    board,
    queenPositions: positions,
    stepsCount: steps,
    isSolvable
  };
}

// ==========================================
// 4. Sum of Subsets (Exact Room Capacity Packing)
// ==========================================
export interface SumOfSubsetsResult {
  targetCapacity: number;
  batchSizes: number[];
  solutions: number[][];
  nodesExplored: number;
}

export function solveSumOfSubsets(
  targetCapacity: number = 60, // e.g. D-305 capacity
  batchSizes: number[] = [15, 20, 25, 35, 40, 10]
): SumOfSubsetsResult {
  const sorted = [...batchSizes].sort((a, b) => a - b);
  const solutions: number[][] = [];
  let explored = 0;

  function backtrack(idx: number, currentSum: number, currentSubset: number[]) {
    explored++;
    if (currentSum === targetCapacity) {
      solutions.push([...currentSubset]);
      return;
    }

    for (let i = idx; i < sorted.length; i++) {
      if (currentSum + sorted[i] > targetCapacity) {
        break; // Prune branch since array is sorted
      }
      currentSubset.push(sorted[i]);
      backtrack(i + 1, currentSum + sorted[i], currentSubset);
      currentSubset.pop(); // Backtrack
    }
  }

  backtrack(0, 0, []);

  return {
    targetCapacity,
    batchSizes: sorted,
    solutions,
    nodesExplored: explored
  };
}
