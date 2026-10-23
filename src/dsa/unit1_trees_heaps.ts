/**
 * Unit 1: Trees & Heaps Implementation
 * Based on NIET PBL Final Report: Intelligent Campus Resource Optimization System
 * Topics: Binary Tree Traversals, BST (Insert/Search/Delete), AVL Trees (4 Rotations & BF),
 * Threaded Binary Tree, Max-Heap Priority Queue, Heap Sort.
 */

// ==========================================
// 1. Binary Tree Traversals
// ==========================================
export interface BTNode<T> {
  value: T;
  left?: BTNode<T>;
  right?: BTNode<T>;
}

export class CampusFacilityHierarchy {
  root: BTNode<string>;

  constructor() {
    // Hierarchical campus tree: Campus -> Block A/B/D/E -> Labs/Rooms
    this.root = {
      value: 'NIET Campus (Autonomous)',
      left: {
        value: 'West Wing (Blocks A & B)',
        left: {
          value: 'Block A (Main Admin)',
          left: { value: 'A-101 Kalam Auditorium (320 cap)' },
          right: { value: 'A-201 Council Hall (100 cap)' }
        },
        right: {
          value: 'Block B (Computing & AI)',
          left: { value: 'B-105 Data Structures Lab (60 cap)' },
          right: { value: 'B-205 AI Research Lab (60 cap)' }
        }
      },
      right: {
        value: 'East & South Wing (Blocks D & E)',
        left: {
          value: 'Block E (Innovation Hub)',
          left: { value: 'E-101 Robotics Lab (50 cap)' },
          right: { value: 'E-201 Startup Incubator (75 cap)' }
        },
        right: {
          value: 'Block D (CSE & IT Core)',
          left: { value: 'D-101 Alan Turing Hall (140 cap)' },
          right: { value: 'D-305 OS & Cloud Lab (60 cap)' }
        }
      }
    };
  }

  inOrderTraversal(): string[] {
    const result: string[] = [];
    const traverse = (node?: BTNode<string>) => {
      if (!node) return;
      traverse(node.left);
      result.push(node.value);
      traverse(node.right);
    };
    traverse(this.root);
    return result;
  }

  preOrderTraversal(): string[] {
    const result: string[] = [];
    const traverse = (node?: BTNode<string>) => {
      if (!node) return;
      result.push(node.value);
      traverse(node.left);
      traverse(node.right);
    };
    traverse(this.root);
    return result;
  }

  postOrderTraversal(): string[] {
    const result: string[] = [];
    const traverse = (node?: BTNode<string>) => {
      if (!node) return;
      traverse(node.left);
      traverse(node.right);
      result.push(node.value);
    };
    traverse(this.root);
    return result;
  }
}

// ==========================================
// 2. Binary Search Tree (BST)
// ==========================================
export interface BSTNode {
  key: number; // e.g. Room code number: 101, 105, 201, 205, 305
  name: string;
  building: string;
  capacity: number;
  left: BSTNode | null;
  right: BSTNode | null;
}

export class RoomBST {
  root: BSTNode | null = null;
  logs: string[] = [];

  constructor() {
    // Seed initial campus rooms
    const initialRooms = [
      { key: 201, name: 'A-201 Council Hall', building: 'Block A', capacity: 100 },
      { key: 101, name: 'A-101 Kalam Hall', building: 'Block A', capacity: 320 },
      { key: 305, name: 'D-305 OS Lab', building: 'Block D', capacity: 60 },
      { key: 105, name: 'B-105 DS Lab', building: 'Block B', capacity: 60 },
      { key: 205, name: 'B-205 AI Lab', building: 'Block B', capacity: 60 }
    ];
    for (const r of initialRooms) {
      this.insert(r.key, r.name, r.building, r.capacity);
    }
    this.logs = ['Initialized RoomBST with campus standard facilities.'];
  }

  insert(key: number, name: string, building: string, capacity: number): boolean {
    const newNode: BSTNode = { key, name, building, capacity, left: null, right: null };
    if (!this.root) {
      this.root = newNode;
      this.logs.push(`BST: Inserted root room key #${key} (${name})`);
      return true;
    }

    let curr: BSTNode = this.root;
    while (true) {
      if (key === curr.key) {
        this.logs.push(`BST Warning: Room key #${key} already exists in BST.`);
        return false;
      }
      if (key < curr.key) {
        if (!curr.left) {
          curr.left = newNode;
          this.logs.push(`BST: Inserted room #${key} (${name}) to left of #${curr.key}`);
          return true;
        }
        curr = curr.left;
      } else {
        if (!curr.right) {
          curr.right = newNode;
          this.logs.push(`BST: Inserted room #${key} (${name}) to right of #${curr.key}`);
          return true;
        }
        curr = curr.right;
      }
    }
  }

  search(key: number): { found: boolean; node?: BSTNode; path: number[] } {
    const path: number[] = [];
    let curr = this.root;
    while (curr) {
      path.push(curr.key);
      if (curr.key === key) {
        this.logs.push(`BST Search: Found room #${key} (${curr.name}) in ${path.length} hops.`);
        return { found: true, node: curr, path };
      }
      curr = key < curr.key ? curr.left : curr.right;
    }
    this.logs.push(`BST Search: Room key #${key} not found after ${path.length} hops.`);
    return { found: false, path };
  }

  delete(key: number): boolean {
    let deleted = false;
    const deleteNode = (root: BSTNode | null, targetKey: number): BSTNode | null => {
      if (!root) return null;
      if (targetKey < root.key) {
        root.left = deleteNode(root.left, targetKey);
      } else if (targetKey > root.key) {
        root.right = deleteNode(root.right, targetKey);
      } else {
        deleted = true;
        // Case 1 & 2: 0 or 1 child
        if (!root.left) return root.right;
        if (!root.right) return root.left;
        // Case 3: 2 children -> get in-order successor
        let succ = root.right;
        while (succ.left) succ = succ.left;
        root.key = succ.key;
        root.name = succ.name;
        root.building = succ.building;
        root.capacity = succ.capacity;
        root.right = deleteNode(root.right, succ.key);
      }
      return root;
    };

    this.root = deleteNode(this.root, key);
    if (deleted) {
      this.logs.push(`BST: Successfully deleted room key #${key}.`);
    } else {
      this.logs.push(`BST: Could not delete room key #${key} (not found).`);
    }
    return deleted;
  }
}

// ==========================================
// 3. AVL Tree (Rotations & Balance Factor)
// ==========================================
export interface AVLNode {
  key: number;
  roomCode: string;
  height: number;
  left: AVLNode | null;
  right: AVLNode | null;
}

export class CampusAVLTree {
  root: AVLNode | null = null;
  rotationHistory: string[] = [];

  constructor() {
    // Seed initial nodes triggering balance demonstration
    [101, 105, 201, 205, 301, 305].forEach(k => {
      this.insert(k, `Room-${k}`);
    });
  }

  private getHeight(node: AVLNode | null): number {
    return node ? node.height : 0;
  }

  getBalanceFactor(node: AVLNode | null): number {
    return node ? this.getHeight(node.left) - this.getHeight(node.right) : 0;
  }

  private updateHeight(node: AVLNode): void {
    node.height = 1 + Math.max(this.getHeight(node.left), this.getHeight(node.right));
  }

  // Right Rotation (LL Case)
  private rotateRight(y: AVLNode): AVLNode {
    const x = y.left!;
    const T2 = x.right;
    x.right = y;
    y.left = T2;
    this.updateHeight(y);
    this.updateHeight(x);
    this.rotationHistory.unshift(`Rotated Right (LL Fix) at Node ${y.key}: ${x.key} is new sub-root.`);
    return x;
  }

  // Left Rotation (RR Case)
  private rotateLeft(x: AVLNode): AVLNode {
    const y = x.right!;
    const T2 = y.left;
    y.left = x;
    x.right = T2;
    this.updateHeight(x);
    this.updateHeight(y);
    this.rotationHistory.unshift(`Rotated Left (RR Fix) at Node ${x.key}: ${y.key} is new sub-root.`);
    return y;
  }

  insert(key: number, roomCode: string): void {
    const insertRec = (node: AVLNode | null): AVLNode => {
      if (!node) {
        return { key, roomCode, height: 1, left: null, right: null };
      }

      if (key < node.key) {
        node.left = insertRec(node.left);
      } else if (key > node.key) {
        node.right = insertRec(node.right);
      } else {
        return node; // Duplicate keys not allowed in AVL
      }

      this.updateHeight(node);
      const balance = this.getBalanceFactor(node);

      // Left-Left (LL) Case
      if (balance > 1 && key < node.left!.key) {
        return this.rotateRight(node);
      }
      // Right-Right (RR) Case
      if (balance < -1 && key > node.right!.key) {
        return this.rotateLeft(node);
      }
      // Left-Right (LR) Case
      if (balance > 1 && key > node.left!.key) {
        this.rotationHistory.unshift(`LR Case: Left rotate on ${node.left!.key}, then Right rotate on ${node.key}`);
        node.left = this.rotateLeft(node.left!);
        return this.rotateRight(node);
      }
      // Right-Left (RL) Case
      if (balance < -1 && key < node.right!.key) {
        this.rotationHistory.unshift(`RL Case: Right rotate on ${node.right!.key}, then Left rotate on ${node.key}`);
        node.right = this.rotateRight(node.right!);
        return this.rotateLeft(node);
      }

      return node;
    };

    this.root = insertRec(this.root);
  }
}

// ==========================================
// 4. Threaded Binary Tree
// ==========================================
export interface ThreadedNode {
  key: number;
  label: string;
  left: ThreadedNode | null;
  right: ThreadedNode | null;
  isThreaded: boolean; // true if right points to in-order successor
}

export class CampusThreadedBinaryTree {
  root: ThreadedNode | null = null;

  constructor() {
    // Construct sample threaded tree
    const n1: ThreadedNode = { key: 101, label: 'A-101', left: null, right: null, isThreaded: true };
    const n2: ThreadedNode = { key: 105, label: 'B-105', left: null, right: null, isThreaded: false };
    const n3: ThreadedNode = { key: 201, label: 'A-201', left: null, right: null, isThreaded: true };
    const n4: ThreadedNode = { key: 305, label: 'D-305', left: null, right: null, isThreaded: false };

    n2.left = n1;
    n1.right = n2; // thread to in-order successor (B-105)
    n2.right = n4;
    n4.left = n3;
    n3.right = n4; // thread to in-order successor (D-305)

    this.root = n2;
  }

  // Traversal without stack or recursion
  traverseWithoutStack(): string[] {
    const result: string[] = [];
    let curr = this.root;
    if (!curr) return result;

    // Find leftmost node
    while (curr.left) {
      curr = curr.left;
    }

    while (curr) {
      result.push(`${curr.label} (#${curr.key})`);
      if (curr.isThreaded) {
        curr = curr.right; // Follow thread in O(1)
      } else {
        curr = curr.right;
        if (curr) {
          while (curr.left) {
            curr = curr.left;
          }
        }
      }
    }
    return result;
  }
}

// ==========================================
// 5. Max-Heap Priority Queue & Heap Sort
// ==========================================
export interface PriorityBookingRequest {
  id: string;
  title: string;
  facultyName: string;
  priorityScore: number; // Higher is served first (Dean = 95, Urgent Exam = 85, Regular = 40)
  roomCode: string;
  slot: string;
}

export class MaxHeapPriorityQueue {
  private heap: PriorityBookingRequest[] = [];

  constructor() {
    // Seed initial prioritized campus booking requests
    this.insert({
      id: 'REQ-101',
      title: 'Dean Academic Council Urgent Assembly',
      facultyName: 'Dean Academics',
      priorityScore: 98,
      roomCode: 'A-201',
      slot: '09:00 - 10:30'
    });
    this.insert({
      id: 'REQ-102',
      title: 'End-Term Cloud Practicum Exam',
      facultyName: 'Prof. Sharma (CSE)',
      priorityScore: 84,
      roomCode: 'D-305',
      slot: '10:30 - 12:00'
    });
    this.insert({
      id: 'REQ-103',
      title: 'Robotics Team Workshop',
      facultyName: 'Dr. Verma (IT)',
      priorityScore: 55,
      roomCode: 'E-101',
      slot: '13:00 - 14:30'
    });
    this.insert({
      id: 'REQ-104',
      title: 'Weekly Tutorial Discussion',
      facultyName: 'Sahil Patel (Student Club)',
      priorityScore: 35,
      roomCode: 'B-105',
      slot: '14:30 - 16:00'
    });
  }

  size(): number {
    return this.heap.length;
  }

  getAll(): PriorityBookingRequest[] {
    return [...this.heap];
  }

  insert(req: PriorityBookingRequest): void {
    this.heap.push(req);
    this.heapifyUp(this.heap.length - 1);
  }

  extractMax(): PriorityBookingRequest | null {
    if (this.heap.length === 0) return null;
    const max = this.heap[0];
    const end = this.heap.pop()!;
    if (this.heap.length > 0) {
      this.heap[0] = end;
      this.heapifyDown(0);
    }
    return max;
  }

  private heapifyUp(index: number): void {
    let curr = index;
    while (curr > 0) {
      const parent = Math.floor((curr - 1) / 2);
      if (this.heap[curr].priorityScore > this.heap[parent].priorityScore) {
        [this.heap[curr], this.heap[parent]] = [this.heap[parent], this.heap[curr]];
        curr = parent;
      } else {
        break;
      }
    }
  }

  private heapifyDown(index: number): void {
    let curr = index;
    const length = this.heap.length;
    while (true) {
      let largest = curr;
      const left = 2 * curr + 1;
      const right = 2 * curr + 2;

      if (left < length && this.heap[left].priorityScore > this.heap[largest].priorityScore) {
        largest = left;
      }
      if (right < length && this.heap[right].priorityScore > this.heap[largest].priorityScore) {
        largest = right;
      }
      if (largest !== curr) {
        [this.heap[curr], this.heap[largest]] = [this.heap[largest], this.heap[curr]];
        curr = largest;
      } else {
        break;
      }
    }
  }
}

// In-place Heap Sort implementation
export function heapSortRequests(requests: PriorityBookingRequest[]): { sorted: PriorityBookingRequest[]; steps: string[] } {
  const arr = [...requests];
  const steps: string[] = [];
  const n = arr.length;

  // 1. Build max heap
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    heapify(arr, n, i);
  }
  steps.push(`Built initial Max-Heap of ${n} elements.`);

  // 2. Extract elements one by one from heap
  for (let i = n - 1; i > 0; i--) {
    [arr[0], arr[i]] = [arr[i], arr[0]];
    steps.push(`Moved root max (Score ${arr[i].priorityScore}) to position ${i}`);
    heapify(arr, i, 0);
  }

  return { sorted: arr, steps };
}

function heapify(arr: PriorityBookingRequest[], n: number, i: number) {
  let largest = i;
  const l = 2 * i + 1;
  const r = 2 * i + 2;

  if (l < n && arr[l].priorityScore > arr[largest].priorityScore) {
    largest = l;
  }
  if (r < n && arr[r].priorityScore > arr[largest].priorityScore) {
    largest = r;
  }
  if (largest !== i) {
    [arr[i], arr[largest]] = [arr[largest], arr[i]];
    heapify(arr, n, largest);
  }
}
