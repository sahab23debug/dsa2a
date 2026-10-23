/**
 * Unit 2: Graph Algorithms Implementation
 * Based on NIET PBL Final Report: Intelligent Campus Resource Optimization System
 * Topics: Adjacency Matrix & Adjacency List, BFS, DFS, Kruskal's MST (Disjoint Sets),
 * Prim's MST, Dijkstra's Shortest Path, Bellman-Ford, Floyd-Warshall, Warshall's Transitive Closure.
 */

export interface CampusGraphNode {
  id: string;
  name: string;
  code: string;
  isLocked?: boolean;
}

export interface CampusGraphEdge {
  from: string;
  to: string;
  weight: number; // distance in meters (divided by 20)
  label?: string;
}

export const NIET_GRAPH_NODES: CampusGraphNode[] = [
  { id: 'A', name: 'Block A (Main Admin)', code: 'A' },
  { id: 'B', name: 'Block B (Computing & AI)', code: 'B' },
  { id: 'E', name: 'Block E (Innovation Hub)', code: 'E' },
  { id: 'LAWN', name: 'Central Green Lawn', code: 'LAWN' },
  { id: 'D', name: 'Block D (CSE & IT Core)', code: 'D' },
  { id: 'BH', name: "Boy's Hostel (Locked)", code: 'BH', isLocked: true },
  { id: 'C', name: 'Block C (Workshops - Locked)', code: 'C', isLocked: true },
  { id: 'GH', name: "Girl's Hostel (Locked)", code: 'GH', isLocked: true }
];

// Active walking paths (Original distance divided by 20)
export const NIET_GRAPH_EDGES: CampusGraphEdge[] = [
  { from: 'A', to: 'B', weight: 4 },
  { from: 'A', to: 'LAWN', weight: 8 },
  { from: 'A', to: 'D', weight: 11 },
  { from: 'A', to: 'E', weight: 8 },
  { from: 'B', to: 'E', weight: 4 },
  { from: 'B', to: 'LAWN', weight: 6 },
  { from: 'B', to: 'D', weight: 8 },
  { from: 'E', to: 'LAWN', weight: 8 },
  { from: 'E', to: 'D', weight: 7 },
  { from: 'LAWN', to: 'D', weight: 9 }
];

// 1. Adjacency Matrix & List
export class CampusGraph {
  nodes: CampusGraphNode[];
  edges: CampusGraphEdge[];
  nodeIndex: Map<string, number>;
  adjMatrix: number[][];
  adjList: Map<string, { to: string; weight: number }[]>;

  constructor(nodes: CampusGraphNode[] = NIET_GRAPH_NODES, edges: CampusGraphEdge[] = NIET_GRAPH_EDGES) {
    this.nodes = nodes;
    this.edges = edges;
    this.nodeIndex = new Map();
    this.adjList = new Map();

    nodes.forEach((n, idx) => {
      this.nodeIndex.set(n.id, idx);
      this.adjList.set(n.id, []);
    });

    const N = nodes.length;
    this.adjMatrix = Array.from({ length: N }, () => Array(N).fill(Infinity));
    for (let i = 0; i < N; i++) this.adjMatrix[i][i] = 0;

    edges.forEach(e => {
      const u = this.nodeIndex.get(e.from);
      const v = this.nodeIndex.get(e.to);
      if (u !== undefined && v !== undefined) {
        this.adjMatrix[u][v] = e.weight;
        this.adjMatrix[v][u] = e.weight;
        this.adjList.get(e.from)!.push({ to: e.to, weight: e.weight });
        this.adjList.get(e.to)!.push({ to: e.from, weight: e.weight });
      }
    });
  }

  // BFS: Level-by-level traversal discovering nearest blocks
  bfs(startId: string): { order: string[]; levels: Record<string, number> } {
    const visited = new Set<string>();
    const queue: { id: string; level: number }[] = [{ id: startId, level: 0 }];
    const order: string[] = [];
    const levels: Record<string, number> = {};

    visited.add(startId);
    while (queue.length > 0) {
      const curr = queue.shift()!;
      order.push(curr.id);
      levels[curr.id] = curr.level;

      const neighbors = this.adjList.get(curr.id) || [];
      for (const edge of neighbors) {
        if (!visited.has(edge.to)) {
          visited.add(edge.to);
          queue.push({ id: edge.to, level: curr.level + 1 });
        }
      }
    }
    return { order, levels };
  }

  // DFS: Deep exploration of connected components
  dfs(startId: string): { order: string[]; visitedCount: number } {
    const visited = new Set<string>();
    const order: string[] = [];

    const traverse = (u: string) => {
      visited.add(u);
      order.push(u);
      const neighbors = this.adjList.get(u) || [];
      for (const edge of neighbors) {
        if (!visited.has(edge.to)) {
          traverse(edge.to);
        }
      }
    };

    traverse(startId);
    return { order, visitedCount: visited.size };
  }
}

// 2. Disjoint Set Union (Union-Find with Path Compression and Rank)
export class DisjointSet {
  parent: Map<string, string> = new Map();
  rank: Map<string, number> = new Map();

  constructor(elements: string[]) {
    elements.forEach(el => {
      this.parent.set(el, el);
      this.rank.set(el, 0);
    });
  }

  find(item: string): string {
    if (this.parent.get(item) !== item) {
      this.parent.set(item, this.find(this.parent.get(item)!));
    }
    return this.parent.get(item)!;
  }

  union(a: string, b: string): boolean {
    const rootA = this.find(a);
    const rootB = this.find(b);
    if (rootA === rootB) return false;

    const rankA = this.rank.get(rootA) || 0;
    const rankB = this.rank.get(rootB) || 0;

    if (rankA < rankB) {
      this.parent.set(rootA, rootB);
    } else if (rankA > rankB) {
      this.parent.set(rootB, rootA);
    } else {
      this.parent.set(rootB, rootA);
      this.rank.set(rootA, rankA + 1);
    }
    return true;
  }
}

// 3. Kruskal's Minimum Spanning Tree
export function runKruskalMST(): { mstEdges: CampusGraphEdge[]; totalWeight: number; steps: string[] } {
  // Only connect active academic buildings
  const activeNodes = ['A', 'B', 'E', 'LAWN', 'D'];
  const edges = [...NIET_GRAPH_EDGES].sort((a, b) => a.weight - b.weight);
  const ds = new DisjointSet(activeNodes);
  const mstEdges: CampusGraphEdge[] = [];
  const steps: string[] = [];
  let totalWeight = 0;

  for (const edge of edges) {
    if (ds.union(edge.from, edge.to)) {
      mstEdges.push(edge);
      totalWeight += edge.weight;
      steps.push(`Selected Edge (${edge.from} ↔ ${edge.to}) with weight ${edge.weight}m (No cycle created)`);
      if (mstEdges.length === activeNodes.length - 1) break;
    } else {
      steps.push(`Discarded Edge (${edge.from} ↔ ${edge.to}) with weight ${edge.weight}m (Creates cycle)`);
    }
  }

  return { mstEdges, totalWeight, steps };
}

// 4. Prim's Minimum Spanning Tree
export function runPrimMST(startNode: string = 'A'): { mstEdges: CampusGraphEdge[]; totalWeight: number; steps: string[] } {
  const activeNodes = ['A', 'B', 'E', 'LAWN', 'D'];
  const visited = new Set<string>([startNode]);
  const mstEdges: CampusGraphEdge[] = [];
  const steps: string[] = [`Prim initialized from root ${startNode}`];
  let totalWeight = 0;

  while (visited.size < activeNodes.length) {
    let minEdge: CampusGraphEdge | null = null;
    let minWeight = Infinity;

    for (const edge of NIET_GRAPH_EDGES) {
      const fromVisited = visited.has(edge.from);
      const toVisited = visited.has(edge.to);

      if ((fromVisited && !toVisited) || (toVisited && !fromVisited)) {
        if (edge.weight < minWeight) {
          minWeight = edge.weight;
          minEdge = edge;
        }
      }
    }

    if (minEdge) {
      const nextNode = visited.has(minEdge.from) ? minEdge.to : minEdge.from;
      visited.add(nextNode);
      mstEdges.push(minEdge);
      totalWeight += minEdge.weight;
      steps.push(`Added vertex ${nextNode} via minimum cut edge (${minEdge.from} ↔ ${minEdge.to}) = ${minEdge.weight}m`);
    } else {
      break;
    }
  }

  return { mstEdges, totalWeight, steps };
}

// 5. Dijkstra's Shortest Path
export function runDijkstra(start: string, target?: string): {
  distances: Record<string, number>;
  previous: Record<string, string | null>;
  pathToTarget?: string[];
  totalDist?: number;
} {
  const activeNodes = ['A', 'B', 'E', 'LAWN', 'D'];
  const distances: Record<string, number> = {};
  const previous: Record<string, string | null> = {};
  const unvisited = new Set<string>(activeNodes);

  activeNodes.forEach(node => {
    distances[node] = Infinity;
    previous[node] = null;
  });
  distances[start] = 0;

  while (unvisited.size > 0) {
    let curr: string | null = null;
    let shortest = Infinity;
    for (const node of unvisited) {
      if (distances[node] < shortest) {
        shortest = distances[node];
        curr = node;
      }
    }

    if (!curr || distances[curr] === Infinity) break;
    unvisited.delete(curr);

    if (target && curr === target) break;

    for (const edge of NIET_GRAPH_EDGES) {
      let neighbor: string | null = null;
      if (edge.from === curr) neighbor = edge.to;
      else if (edge.to === curr) neighbor = edge.from;

      if (neighbor && unvisited.has(neighbor)) {
        const alt = distances[curr] + edge.weight;
        if (alt < distances[neighbor]) {
          distances[neighbor] = alt;
          previous[neighbor] = curr;
        }
      }
    }
  }

  let pathToTarget: string[] | undefined;
  let totalDist: number | undefined;

  if (target) {
    pathToTarget = [];
    let step: string | null = target;
    while (step) {
      pathToTarget.unshift(step);
      step = previous[step];
    }
    totalDist = distances[target];
  }

  return { distances, previous, pathToTarget, totalDist };
}

// 6. Bellman-Ford (with Congestion/Delay Penalty)
export function runBellmanFord(start: string, delayPenalty: number = 2): {
  distances: Record<string, number>;
  hasNegativeCycle: boolean;
  steps: string[];
} {
  const activeNodes = ['A', 'B', 'E', 'LAWN', 'D'];
  const distances: Record<string, number> = {};
  const steps: string[] = [];

  activeNodes.forEach(n => distances[n] = Infinity);
  distances[start] = 0;

  // Relax edges |V| - 1 times
  for (let i = 1; i < activeNodes.length; i++) {
    let updated = false;
    for (const edge of NIET_GRAPH_EDGES) {
      const weightWithDelay = edge.weight + (edge.to === 'LAWN' ? delayPenalty : 0); // Rush-hour lawn crossing delay
      
      // Directed in both directions
      if (distances[edge.from] !== Infinity && distances[edge.from] + weightWithDelay < distances[edge.to]) {
        distances[edge.to] = distances[edge.from] + weightWithDelay;
        updated = true;
      }
      if (distances[edge.to] !== Infinity && distances[edge.to] + weightWithDelay < distances[edge.from]) {
        distances[edge.from] = distances[edge.to] + weightWithDelay;
        updated = true;
      }
    }
    steps.push(`Iteration ${i}: ${updated ? 'Relaxed distance vectors' : 'Converged early'}`);
    if (!updated) break;
  }

  return { distances, hasNegativeCycle: false, steps };
}

// 7. Floyd-Warshall All-Pairs Shortest Path
export function runFloydWarshall(): {
  matrix: number[][];
  nodes: string[];
  readable: { from: string; to: string; dist: number }[];
} {
  const nodes = ['A', 'B', 'E', 'LAWN', 'D'];
  const n = nodes.length;
  const dist: number[][] = Array.from({ length: n }, () => Array(n).fill(Infinity));

  for (let i = 0; i < n; i++) dist[i][i] = 0;

  NIET_GRAPH_EDGES.forEach(e => {
    const u = nodes.indexOf(e.from);
    const v = nodes.indexOf(e.to);
    if (u !== -1 && v !== -1) {
      dist[u][v] = e.weight;
      dist[v][u] = e.weight;
    }
  });

  for (let k = 0; k < n; k++) {
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        if (dist[i][k] + dist[k][j] < dist[i][j]) {
          dist[i][j] = dist[i][k] + dist[k][j];
        }
      }
    }
  }

  const readable: { from: string; to: string; dist: number }[] = [];
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      readable.push({ from: nodes[i], to: nodes[j], dist: dist[i][j] });
    }
  }

  return { matrix: dist, nodes, readable };
}

// 8. Warshall's Transitive Closure (Reachability)
export function runWarshallTransitiveClosure(): {
  nodes: string[];
  reachabilityMatrix: boolean[][];
} {
  const allNodes = ['A', 'B', 'E', 'LAWN', 'D', 'BH', 'C', 'GH'];
  const n = allNodes.length;
  const reach: boolean[][] = Array.from({ length: n }, () => Array(n).fill(false));

  for (let i = 0; i < n; i++) reach[i][i] = true;

  NIET_GRAPH_EDGES.forEach(e => {
    const u = allNodes.indexOf(e.from);
    const v = allNodes.indexOf(e.to);
    if (u !== -1 && v !== -1) {
      reach[u][v] = true;
      reach[v][u] = true;
    }
  });

  for (let k = 0; k < n; k++) {
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        reach[i][j] = reach[i][j] || (reach[i][k] && reach[k][j]);
      }
    }
  }

  return { nodes: allNodes, reachabilityMatrix: reach };
}
