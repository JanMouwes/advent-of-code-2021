import { Grid, neighbours, forEach, Coord, map } from './grid';
import { first, second, Tuple, equals } from './tuple';
import { constant, Fn2 } from './fn';
import { Heap } from './data-structures/heap';

export type Graph<T> = readonly Node<T>[]
export type Node<T> = Tuple<T, readonly Edge<T>[]>
export type Edge<T> = Tuple<Node<T>, number>
export type Path<T> = readonly Edge<T>[]

export function fromGrid<T>(grid: Grid<T>, cost: Fn2<[T, Coord], [T, Coord], number> = constant(1)): Graph<[T, Coord]> {
  type WithCoord = [T, Coord];
  type GridNode = Tuple<WithCoord, Edge<WithCoord>[]>;

  const graphMap: Map<string, GridNode> = new Map<string, GridNode>();
  const graph: Node<WithCoord>[] = [];

  const toString = ([x, y]: Coord) => `[${x}, ${y}]`;

  forEach(grid, (v, c) => graphMap.set(toString(c), [[v, c], []]))

  forEach(grid, (v, c) => {
    const [val, edges] = graphMap.get(toString(c))!;

    neighbours(c, grid)
      .map(toString)
      .map((s) => graphMap.get(s)!)
      .map(n => ([n, cost([v, c], first(n))] as Edge<WithCoord>))
      .forEach(edge => edges.push(edge));

    graph.push([val, edges]);
  });

  return graph;
}

export function findPaths<T>(start: Node<T>): Map<Node<T>, Path<T>> {
  const queue: [[Node<T>, Edge<T>], number][] = second(start).map(edge => [[start, edge], 0]);
  const known = new Map<Node<T>, [Edge<T>, number]>();

  while (queue.length > 0) {
    queue.sort((entry1, entry2) => second(entry1) - second(entry2));

    const [[prev, [node, dist]], total] = queue.shift()!;

    if (known.has(node)) { continue; }

    known.set(node, [[prev, dist], total]);

    const [, edges] = node;

    edges.forEach(edge => queue.push([[node, edge], total + second(edge)]))
  }

  const entries: [Node<T>, Path<T>][] = [...known.keys()].map((node) => [node, collapsePath(node, known)]);

  return new Map<Node<T>, Path<T>>(entries);
}

/**
 * Finds path between nodes using the A* algorithm
 * 
 * @template T
 * @param {Node<T>} start 
 * @param {Node<T>} end 
 * @returns {Path<T>} path
 */
export function findPath<T>(start: Node<T>, end: Node<T>, heuristic: Fn2<Node<T>, Node<T>, number> = constant(1)): Path<T> {
  type QueueEntry = { node: [Node<T>, Edge<T>], total: number, heur: number };

  let queue: Heap<QueueEntry> = new Heap<QueueEntry>(({ total: t1, heur: h1 }, { total: t2, heur: h2 }) => (t1 + h1) - (t2 + h2));
  second(start).map(edge => queue.insert({ node: [start, edge], total: 0, heur: 0 }));

  const known = new Map<Node<T>, [Edge<T>, number]>();

  while (queue.size > 0 && !known.has(end)) {
    const { node: [prev, [node, dist]], total } = queue.pop();

    if (known.has(node)) { continue; }

    known.set(node, [[prev, dist], total]);

    const [, edges] = node;

    edges.forEach((e: Edge<T>) => queue.insert({
      node: [node, e],
      total: total + second(e),
      heur: heuristic(node, end)
    }));
  }

  end = [...known.keys()].find(n => equals(n, end))!;
  return collapsePath(end, known);
}

function collapsePath<T>(node: Node<T>, known: Map<Node<T>, [Edge<T>, number]>) {
  const path: Edge<T>[] = [];

  if (!known.has(node)) { throw new Error("node not in known"); }

  while (known.has(node)) {
    const edge = known.get(node)!;
    const [prev, cost] = edge

    path.push([node, cost]);
    node = first(prev);
  }

  const pathStart = [node, 0] as Edge<T>;

  return [...path, pathStart].reverse();
}

export function nodes<T>(path: Path<T>) {
  return path.map(first);
}
