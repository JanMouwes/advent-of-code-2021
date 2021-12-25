import { CompareFn } from '../sort';

export class Heap<T> {

  private tree: T[] = [];
  private _size: number = 0;

  get size() {
    return this._size;
  }

  constructor(private readonly compare: CompareFn<T>) { }

  pop(): T {
    const top = this.tree[1];
    let node = 1;

    this.swap(node, this.size);
    this._size--;

    // percolate previous 'last' node down
    while (node * 2 < this.size + 1 && this.childrenOf(node).some(c => this.isSmaller(c, node))) {
      const child = this.smallestChildOf(node);

      this.swap(node, child);

      node = child;
    }

    return top;
  }

  insert(item: T) {
    this.tree[this.size + 1] = item;

    let node = this.size + 1;
    let parent = Math.floor(node / 2);

    // percolate last node upwards
    while (node > 1 && this.isSmaller(node, parent)) {
      this.swap(node, parent);
      node = parent;
      parent = Math.floor(node / 2);
    }

    this._size++;
  }

  swap(index1: number, index2: number): void {
    const tmp = this.tree[index2];
    this.tree[index2] = this.tree[index1];
    this.tree[index1] = tmp;
  }

  toString(): string {
    return this.tree.slice(1, this.size + 1).toString();
  }

  private isSmaller(index1: number, index2: number) {
    return this.compare(this.tree[index1], this.tree[index2]) < 1;
  }

  private childrenOf(node: number): [number] | [number, number] {
    let child1 = node * 2;
    let child2 = child1 + 1;

    if (child2 > this.size) {
      return [child1];
    }

    return [child1, child2];
  }

  private smallestChildOf(node: number): number {
    let child1 = node * 2;
    let child2 = child1 + 1;

    if (child2 > this.size) {
      return child1;
    }

    return this.isSmaller(child1, child2) ? child1 : child2;
  }
}