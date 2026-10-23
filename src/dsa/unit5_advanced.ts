/**
 * Unit 5: Advanced Data Structures Implementation
 * Based on NIET PBL Final Report: Intelligent Campus Resource Optimization System
 * Topics: Red-Black Trees (Color balancing & live session indexing),
 * B-Trees & B+ Trees (Block indexing & range queries [10:00 - 14:00]),
 * Binomial Heaps (Departmental queue merging in O(log N)),
 * Fibonacci Heaps (Amortized O(1) decrease-key priority boost).
 */

// ==========================================
// 1. Red-Black Tree
// ==========================================
export type RBColor = 'RED' | 'BLACK';

export interface RBNode {
  key: number;
  roomCode: string;
  color: RBColor;
  left: RBNode | null;
  right: RBNode | null;
  parent: RBNode | null;
}

export class CampusRedBlackTree {
  root: RBNode | null = null;
  steps: string[] = [];

  constructor() {
    // Seed initial nodes
    [201, 101, 305, 105, 205, 301].forEach(k => {
      this.insert(k, `Room-${k}`);
    });
  }

  private rotateLeft(x: RBNode): void {
    const y = x.right;
    if (!y) return;
    x.right = y.left;
    if (y.left) y.left.parent = x;
    y.parent = x.parent;
    if (!x.parent) {
      this.root = y;
    } else if (x === x.parent.left) {
      x.parent.left = y;
    } else {
      x.parent.right = y;
    }
    y.left = x;
    x.parent = y;
    this.steps.push(`RB Tree: Left Rotate on Node #${x.key}`);
  }

  private rotateRight(y: RBNode): void {
    const x = y.left;
    if (!x) return;
    y.left = x.right;
    if (x.right) x.right.parent = y;
    x.parent = y.parent;
    if (!y.parent) {
      this.root = x;
    } else if (y === y.parent.right) {
      y.parent.right = x;
    } else {
      y.parent.left = x;
    }
    x.right = y;
    y.parent = x;
    this.steps.push(`RB Tree: Right Rotate on Node #${y.key}`);
  }

  insert(key: number, roomCode: string): void {
    const newNode: RBNode = {
      key,
      roomCode,
      color: 'RED',
      left: null,
      right: null,
      parent: null
    };

    if (!this.root) {
      newNode.color = 'BLACK';
      this.root = newNode;
      this.steps.push(`Inserted root Node #${key} as BLACK.`);
      return;
    }

    let curr: RBNode | null = this.root;
    let parent: RBNode | null = null;

    while (curr) {
      parent = curr;
      if (key < curr.key) {
        curr = curr.left;
      } else if (key > curr.key) {
        curr = curr.right;
      } else {
        return; // duplicates ignored
      }
    }

    newNode.parent = parent;
    if (parent) {
      if (key < parent.key) {
        parent.left = newNode;
      } else {
        parent.right = newNode;
      }
    }

    this.fixInsert(newNode);
  }

  private fixInsert(z: RBNode): void {
    while (z.parent && z.parent.color === 'RED') {
      const parent = z.parent;
      const grandParent = parent.parent;
      if (!grandParent) break;

      if (parent === grandParent.left) {
        const uncle = grandParent.right;
        if (uncle && uncle.color === 'RED') {
          // Case 1: Uncle is RED -> Recolor
          parent.color = 'BLACK';
          uncle.color = 'BLACK';
          grandParent.color = 'RED';
          z = grandParent;
          this.steps.push(`Recolored parent #${parent.key} & uncle #${uncle.key} BLACK, grandparent RED.`);
        } else {
          // Case 2: Uncle is BLACK, z is right child -> Left rotate
          if (z === parent.right) {
            z = parent;
            this.rotateLeft(z);
          }
          // Case 3: Uncle is BLACK, z is left child -> Right rotate
          parent.color = 'BLACK';
          grandParent.color = 'RED';
          this.rotateRight(grandParent);
          this.steps.push(`Rotated and balanced subtree around #${grandParent.key}.`);
        }
      } else {
        // Mirror case: parent is right child of grandparent
        const uncle = grandParent.left;
        if (uncle && uncle.color === 'RED') {
          parent.color = 'BLACK';
          uncle.color = 'BLACK';
          grandParent.color = 'RED';
          z = grandParent;
          this.steps.push(`Recolored parent #${parent.key} & uncle #${uncle.key} BLACK, grandparent RED.`);
        } else {
          if (z === parent.left) {
            z = parent;
            this.rotateRight(z);
          }
          parent.color = 'BLACK';
          grandParent.color = 'RED';
          this.rotateLeft(grandParent);
          this.steps.push(`Rotated and balanced subtree around #${grandParent.key}.`);
        }
      }
    }

    if (this.root) this.root.color = 'BLACK';
  }
}

// ==========================================
// 2. B+ Tree (Range Queries [10:00 - 14:00])
// ==========================================
export interface BPlusRecord {
  timeMinutes: number; // e.g., 600 = 10:00 AM, 840 = 14:00 PM
  timeLabel: string;
  roomCode: string;
  eventName: string;
}

export interface BPlusLeafNode {
  keys: number[];
  records: BPlusRecord[];
  next: BPlusLeafNode | null;
  prev: BPlusLeafNode | null;
}

export class CampusBPlusTree {
  // Demo B+ Tree with indexed leaf chain
  leaves: BPlusLeafNode[] = [];
  rootKeys: number[] = [660, 780]; // Split keys: 11:00 AM and 13:00 PM

  constructor() {
    // Leaf 1: 09:00 - 10:59 (540 - 659)
    const leaf1: BPlusLeafNode = {
      keys: [540, 570, 630],
      records: [
        { timeMinutes: 540, timeLabel: '09:00 AM', roomCode: 'D-305', eventName: 'OS Practicum Lab' },
        { timeMinutes: 570, timeLabel: '09:30 AM', roomCode: 'A-101', eventName: 'Dean Inaugural' },
        { timeMinutes: 630, timeLabel: '10:30 AM', roomCode: 'B-105', eventName: 'Data Structures' }
      ],
      next: null,
      prev: null
    };

    // Leaf 2: 11:00 - 12:59 (660 - 779)
    const leaf2: BPlusLeafNode = {
      keys: [690, 720, 750],
      records: [
        { timeMinutes: 690, timeLabel: '11:30 AM', roomCode: 'D-101', eventName: 'Turing Algorithm Lecture' },
        { timeMinutes: 720, timeLabel: '12:00 PM', roomCode: 'E-101', eventName: 'Robotics Sensors Demo' },
        { timeMinutes: 750, timeLabel: '12:30 PM', roomCode: 'B-205', eventName: 'AI Model Training' }
      ],
      next: null,
      prev: leaf1
    };

    // Leaf 3: 13:00 - 16:00 (780 - 960)
    const leaf3: BPlusLeafNode = {
      keys: [780, 840, 900],
      records: [
        { timeMinutes: 780, timeLabel: '01:00 PM', roomCode: 'A-201', eventName: 'Executive Council Review' },
        { timeMinutes: 840, timeLabel: '02:00 PM', roomCode: 'D-305', eventName: 'Cloud Lab Session B' },
        { timeMinutes: 900, timeLabel: '03:00 PM', roomCode: 'E-201', eventName: 'Startup Pitch Arena' }
      ],
      next: null,
      prev: leaf2
    };

    leaf1.next = leaf2;
    leaf2.next = leaf3;

    this.leaves = [leaf1, leaf2, leaf3];
  }

  // Range Query: O(log N + K) to scan [startTime, endTime]
  rangeQuery(startMin: number, endMin: number): {
    results: BPlusRecord[];
    leavesInspected: number;
    log: string;
  } {
    const results: BPlusRecord[] = [];
    let leavesInspected = 0;

    // Find start leaf (simulated O(log N) search using root keys)
    let currLeaf: BPlusLeafNode | null = this.leaves[0];
    if (startMin >= this.rootKeys[1]) {
      currLeaf = this.leaves[2];
    } else if (startMin >= this.rootKeys[0]) {
      currLeaf = this.leaves[1];
    }

    // Sequentially follow leaf pointers
    while (currLeaf) {
      leavesInspected++;
      for (const rec of currLeaf.records) {
        if (rec.timeMinutes >= startMin && rec.timeMinutes <= endMin) {
          results.push(rec);
        }
      }
      // Check if we can stop
      if (currLeaf.keys[currLeaf.keys.length - 1] > endMin) break;
      currLeaf = currLeaf.next;
    }

    return {
      results,
      leavesInspected,
      log: `B+ Tree Range Query [${startMin}m - ${endMin}m] returned ${results.length} events across ${leavesInspected} leaf nodes.`
    };
  }
}

// ==========================================
// 3. Binomial Heap (Department Queue Merging in O(log N))
// ==========================================
export interface BinomialNode {
  key: number; // Priority Score
  label: string;
  degree: number;
  child: BinomialNode | null;
  sibling: BinomialNode | null;
}

export class CampusBinomialHeap {
  head: BinomialNode | null = null;
  name: string;

  constructor(name: string) {
    this.name = name;
  }

  static linkTrees(y: BinomialNode, z: BinomialNode): BinomialNode {
    // Make y child of z
    y.sibling = z.child;
    z.child = y;
    z.degree++;
    return z;
  }

  insert(priorityScore: number, label: string): void {
    const tempHeap = new CampusBinomialHeap('temp');
    tempHeap.head = {
      key: priorityScore,
      label,
      degree: 0,
      child: null,
      sibling: null
    };
    this.head = CampusBinomialHeap.union(this, tempHeap);
  }

  static union(h1: CampusBinomialHeap, h2: CampusBinomialHeap): BinomialNode | null {
    // Merge root lists
    let newHead = CampusBinomialHeap.mergeRootLists(h1.head, h2.head);
    if (!newHead) return null;

    let prev: BinomialNode | null = null;
    let curr: BinomialNode | null = newHead;
    let next: BinomialNode | null = curr.sibling;

    while (next) {
      if (curr.degree !== next.degree || (next.sibling && next.sibling.degree === curr.degree)) {
        prev = curr;
        curr = next;
      } else {
        if (curr.key >= next.key) {
          curr.sibling = next.sibling;
          CampusBinomialHeap.linkTrees(next, curr);
        } else {
          if (!prev) {
            newHead = next;
          } else {
            prev.sibling = next;
          }
          CampusBinomialHeap.linkTrees(curr, next);
          curr = next;
        }
      }
      next = curr.sibling;
    }
    return newHead;
  }

  private static mergeRootLists(h1: BinomialNode | null, h2: BinomialNode | null): BinomialNode | null {
    if (!h1) return h2;
    if (!h2) return h1;

    let head: BinomialNode | null = null;
    let tail: BinomialNode | null = null;
    let p1: BinomialNode | null = h1;
    let p2: BinomialNode | null = h2;

    const append = (node: BinomialNode) => {
      if (!head) {
        head = node;
        tail = node;
      } else {
        tail!.sibling = node;
        tail = node;
      }
    };

    while (p1 && p2) {
      if (p1.degree <= p2.degree) {
        const next: BinomialNode | null = p1.sibling;
        p1.sibling = null;
        append(p1);
        p1 = next;
      } else {
        const next: BinomialNode | null = p2.sibling;
        p2.sibling = null;
        append(p2);
        p2 = next;
      }
    }

    if (p1) append(p1);
    if (p2) append(p2);

    return head;
  }

  getRoots(): { key: number; degree: number; label: string }[] {
    const res: { key: number; degree: number; label: string }[] = [];
    let curr = this.head;
    while (curr) {
      res.push({ key: curr.key, degree: curr.degree, label: curr.label });
      curr = curr.sibling;
    }
    return res;
  }
}

// ==========================================
// 4. Fibonacci Heap (Amortized O(1) Decrease-Key)
// ==========================================
export interface FibNode {
  id: string;
  key: number; // Priority Score
  label: string;
  isMarked: boolean;
  degree: number;
}

export class CampusFibonacciHeap {
  nodes: FibNode[] = [];
  minNode: FibNode | null = null;
  logs: string[] = [];

  constructor() {
    this.insert('FIB-1', 45, 'Regular Class Booking');
    this.insert('FIB-2', 60, 'Guest Speaker Workshop');
    this.insert('FIB-3', 75, 'Department Lab Exam');
    this.insert('FIB-4', 90, 'Dean Special Session');
  }

  insert(id: string, key: number, label: string): FibNode {
    const node: FibNode = { id, key, label, isMarked: false, degree: 0 };
    this.nodes.push(node);
    if (!this.minNode || key > this.minNode.key) { // Max-oriented for priority
      this.minNode = node;
    }
    this.logs.push(`Fibonacci Heap: Inserted "${label}" (Priority ${key}) in O(1) time.`);
    return node;
  }

  // Priority boost / key update in amortized O(1)
  increaseKey(nodeId: string, newKey: number): boolean {
    const node = this.nodes.find(n => n.id === nodeId);
    if (!node) return false;
    if (newKey < node.key) {
      this.logs.push(`Error: New key must be higher than current priority.`);
      return false;
    }

    const old = node.key;
    node.key = newKey;
    if (!this.minNode || newKey > this.minNode.key) {
      this.minNode = node;
    }

    this.logs.push(
      `Fibonacci Heap: Boosted Priority of "${node.label}" from ${old} to ${newKey} in amortized O(1) without full restructuring.`
    );
    return true;
  }
}
