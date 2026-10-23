/**
 * Comparative Complexity Matrix (Section 11) & Performance Benchmark Engine (Section 14)
 * Based on NIET PBL Final Report: Intelligent Campus Resource Optimization System
 */

export interface ComplexityRow {
  unit: string;
  topic: string;
  bestTime: string;
  avgTime: string;
  worstTime: string;
  spaceComplexity: string;
  campusApplication: string;
}

export const SECTION_11_COMPLEXITY_TABLE: ComplexityRow[] = [
  // Unit 1
  {
    unit: 'Unit 1: Trees & Heaps',
    topic: 'Binary Tree Traversals (In/Pre/Post)',
    bestTime: 'O(N)',
    avgTime: 'O(N)',
    worstTime: 'O(N)',
    spaceComplexity: 'O(H)',
    campusApplication: 'Hierarchical campus floor taxonomy & facility tree serialization'
  },
  {
    unit: 'Unit 1: Trees & Heaps',
    topic: 'Binary Search Tree (BST)',
    bestTime: 'O(log N)',
    avgTime: 'O(log N)',
    worstTime: 'O(N)',
    spaceComplexity: 'O(N)',
    campusApplication: 'Room code number indexing (101, 105, 201, 205, 305)'
  },
  {
    unit: 'Unit 1: Trees & Heaps',
    topic: 'AVL Tree (4 Rotations & BF)',
    bestTime: 'O(log N)',
    avgTime: 'O(log N)',
    worstTime: 'O(log N)',
    spaceComplexity: 'O(N)',
    campusApplication: 'Strictly height-balanced room lookups preventing worst-case degradation'
  },
  {
    unit: 'Unit 1: Trees & Heaps',
    topic: 'Threaded Binary Tree',
    bestTime: 'O(N)',
    avgTime: 'O(N)',
    worstTime: 'O(N)',
    spaceComplexity: 'O(1) aux',
    campusApplication: 'Stack-less, recursion-free campus facility in-order linear sweeps'
  },
  {
    unit: 'Unit 1: Trees & Heaps',
    topic: 'Max-Heap Priority Queue',
    bestTime: 'O(1) peek',
    avgTime: 'O(log N)',
    worstTime: 'O(log N)',
    spaceComplexity: 'O(N)',
    campusApplication: 'VIP / Dean emergency room reservation overrides'
  },
  {
    unit: 'Unit 1: Trees & Heaps',
    topic: 'Heap Sort',
    bestTime: 'O(N log N)',
    avgTime: 'O(N log N)',
    worstTime: 'O(N log N)',
    spaceComplexity: 'O(1) in-place',
    campusApplication: 'Sorting bulk timetable requests by urgency and class size'
  },

  // Unit 2
  {
    unit: 'Unit 2: Graphs',
    topic: 'Adjacency Matrix',
    bestTime: 'O(1) edge query',
    avgTime: 'O(1)',
    worstTime: 'O(1)',
    spaceComplexity: 'O(V²)',
    campusApplication: 'Dense inter-block connectivity representation for Blocks A, B, E, Lawn, D'
  },
  {
    unit: 'Unit 2: Graphs',
    topic: 'Adjacency List',
    bestTime: 'O(1)',
    avgTime: 'O(deg(V))',
    worstTime: 'O(V)',
    spaceComplexity: 'O(V + E)',
    campusApplication: 'Memory-efficient campus pedestrian footpath network'
  },
  {
    unit: 'Unit 2: Graphs',
    topic: 'BFS (Breadth-First Search)',
    bestTime: 'O(V + E)',
    avgTime: 'O(V + E)',
    worstTime: 'O(V + E)',
    spaceComplexity: 'O(V)',
    campusApplication: 'Finding closest vacant lab by minimum block hops'
  },
  {
    unit: 'Unit 2: Graphs',
    topic: 'DFS (Depth-First Search)',
    bestTime: 'O(V + E)',
    avgTime: 'O(V + E)',
    worstTime: 'O(V + E)',
    spaceComplexity: 'O(V)',
    campusApplication: 'Identifying isolated/locked campus zones (Boy’s/Girl’s Hostels & Block C)'
  },
  {
    unit: 'Unit 2: Graphs',
    topic: "Kruskal's MST (Disjoint Sets)",
    bestTime: 'O(E log E)',
    avgTime: 'O(E log E)',
    worstTime: 'O(E log E)',
    spaceComplexity: 'O(V + E)',
    campusApplication: 'Minimum cost campus fiber-optic internet cabling backbones'
  },
  {
    unit: 'Unit 2: Graphs',
    topic: "Prim's MST (Min-Heap)",
    bestTime: 'O(E log V)',
    avgTime: 'O(E log V)',
    worstTime: 'O(E log V)',
    spaceComplexity: 'O(V)',
    campusApplication: 'Growing minimum cable interconnects outward from Block A admin root'
  },
  {
    unit: 'Unit 2: Graphs',
    topic: "Dijkstra's Shortest Path",
    bestTime: 'O((V + E) log V)',
    avgTime: 'O((V + E) log V)',
    worstTime: 'O((V + E) log V)',
    spaceComplexity: 'O(V)',
    campusApplication: 'Fastest walking route calculation (scaled /20 meters)'
  },
  {
    unit: 'Unit 2: Graphs',
    topic: 'Bellman-Ford Algorithm',
    bestTime: 'O(E)',
    avgTime: 'O(V · E)',
    worstTime: 'O(V · E)',
    spaceComplexity: 'O(V)',
    campusApplication: 'Walking routes accounting for rush-hour elevator/lawn transit delays'
  },
  {
    unit: 'Unit 2: Graphs',
    topic: 'Floyd-Warshall (All-Pairs)',
    bestTime: 'O(V³)',
    avgTime: 'O(V³)',
    worstTime: 'O(V³)',
    spaceComplexity: 'O(V²)',
    campusApplication: 'Precomputing full inter-block walking distance matrix across campus'
  },
  {
    unit: 'Unit 2: Graphs',
    topic: "Warshall's Transitive Closure",
    bestTime: 'O(V³)',
    avgTime: 'O(V³)',
    worstTime: 'O(V³)',
    spaceComplexity: 'O(V²)',
    campusApplication: 'Proving locked hostels/Block C are un-routable from academic zones'
  },

  // Unit 3
  {
    unit: 'Unit 3: Dynamic Programming',
    topic: '0/1 Knapsack Room Allocation',
    bestTime: 'O(N · W)',
    avgTime: 'O(N · W)',
    worstTime: 'O(N · W)',
    spaceComplexity: 'O(N · W)',
    campusApplication: 'Fitting student sections into venues maximizing academic utility'
  },
  {
    unit: 'Unit 3: Dynamic Programming',
    topic: 'Longest Common Subsequence (LCS)',
    bestTime: 'O(M · N)',
    avgTime: 'O(M · N)',
    worstTime: 'O(M · N)',
    spaceComplexity: 'O(M · N)',
    campusApplication: 'Timetable conflict & recurring schedule pattern detection'
  },
  {
    unit: 'Unit 3: Dynamic Programming',
    topic: 'Matrix Chain Multiplication (MCM)',
    bestTime: 'O(N³)',
    avgTime: 'O(N³)',
    worstTime: 'O(N³)',
    spaceComplexity: 'O(N²)',
    campusApplication: 'Optimal join order for campus relational query execution (Rooms ⨝ Bookings)'
  },

  // Unit 4
  {
    unit: 'Unit 4: Backtracking & B&B',
    topic: 'Graph Colouring',
    bestTime: 'O(V)',
    avgTime: 'O(m^V)',
    worstTime: 'O(m^V)',
    spaceComplexity: 'O(V)',
    campusApplication: 'Assigning conflict-free time slots to overlapping exams and practicals'
  },
  {
    unit: 'Unit 4: Backtracking & B&B',
    topic: 'TSP & Hamiltonian Cycle (B&B)',
    bestTime: 'O(V² · 2^V)',
    avgTime: 'Pruned Branch',
    worstTime: 'O(V!)',
    spaceComplexity: 'O(V²)',
    campusApplication: 'Shortest round-trip campus security & maintenance inspection path'
  },
  {
    unit: 'Unit 4: Backtracking & B&B',
    topic: 'n-Queens Problem',
    bestTime: 'O(N)',
    avgTime: 'Pruned Backtrack',
    worstTime: 'O(N!)',
    spaceComplexity: 'O(N)',
    campusApplication: 'Interference-free Wi-Fi access point placement on floor grid'
  },
  {
    unit: 'Unit 4: Backtracking & B&B',
    topic: 'Sum of Subsets',
    bestTime: 'O(2^N)',
    avgTime: 'Pruned Backtrack',
    worstTime: 'O(2^N)',
    spaceComplexity: 'O(N)',
    campusApplication: 'Combining student batches to achieve exact 100% room seat packing'
  },

  // Unit 5
  {
    unit: 'Unit 5: Advanced Structures',
    topic: 'Red-Black Tree',
    bestTime: 'O(log N)',
    avgTime: 'O(log N)',
    worstTime: 'O(log N)',
    spaceComplexity: 'O(N)',
    campusApplication: 'Dynamic live room session indexing with guaranteed O(1) rotation recolor'
  },
  {
    unit: 'Unit 5: Advanced Structures',
    topic: 'B+ Tree',
    bestTime: 'O(log_M N)',
    avgTime: 'O(log_M N)',
    worstTime: 'O(log_M N + K)',
    spaceComplexity: 'O(N)',
    campusApplication: 'Fast range query scan of scheduled sessions in window [10:00 - 14:00]'
  },
  {
    unit: 'Unit 5: Advanced Structures',
    topic: 'Binomial Heap',
    bestTime: 'O(1) insert',
    avgTime: 'O(log N)',
    worstTime: 'O(log N) union',
    spaceComplexity: 'O(N)',
    campusApplication: 'Merging CSE and IT departmental priority reservation queues in O(log N)'
  },
  {
    unit: 'Unit 5: Advanced Structures',
    topic: 'Fibonacci Heap',
    bestTime: 'O(1) amortized',
    avgTime: 'O(1) decrease-key',
    worstTime: 'O(log N) extract-min',
    spaceComplexity: 'O(N)',
    campusApplication: 'Instantaneous O(1) emergency priority boost for Dean directives'
  }
];

// Section 14 Benchmark Simulation
export interface BenchmarkMetric {
  metricName: string;
  baselineFCFS: number | string;
  pblOptimized: number | string;
  improvement: string;
  unit: string;
  badge: string;
}

export const SECTION_14_METRICS: BenchmarkMetric[] = [
  {
    metricName: 'Room Booking Collision / Double-Bookings',
    baselineFCFS: 42,
    pblOptimized: 0,
    improvement: '100% Conflict Elimination (0 Collisions)',
    unit: 'conflicts / day',
    badge: 'Zero Conflicts'
  },
  {
    metricName: 'Average Walking Transit Distance',
    baselineFCFS: '11.4m',
    pblOptimized: '7.1m',
    improvement: '37.7% Reduction in Walking Strain',
    unit: 'meters (scaled /20)',
    badge: 'Shortest Hops'
  },
  {
    metricName: 'Room Seat Capacity Utilization',
    baselineFCFS: '62.5%',
    pblOptimized: '88.9%',
    improvement: '+26.4% Efficiency Gain (Knapsack/Subsets)',
    unit: '% venue utilization',
    badge: 'Optimal Fit'
  },
  {
    metricName: 'Algorithm Query & Scheduling Latency',
    baselineFCFS: '1,240ms',
    pblOptimized: '85ms',
    improvement: '14.6x Faster Computation (B+ Tree/AVL)',
    unit: 'milliseconds',
    badge: 'Ultra Fast'
  }
];
