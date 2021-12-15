import { second, first, id } from './index';

export type Grid<T> = readonly T[][];
export type Coord = readonly [number, number];

export function toString(grid: Grid<any>): string {
  return grid.map(row => row.join(" ")).join("\n")
}

export function valueOf<T>([x, y]: Coord, grid: Grid<T>): T {
  return grid[y][x];
}

export function size(grid: Grid<any>): [number, number] {
  if (grid.length === 0) {
    return [0, 0];
  }

  return [grid[0].length, grid.length];
}

export function neighbours<T>([x, y]: Coord, grid: Grid<T>, countDiagonals: boolean = false): Coord[] {
  const [width, height] = size(grid);

  return [-1, 0, 1].map(n => {
    return [-1, 0, 1]
      .filter(m => countDiagonals || m !== n)
      .map(m => [x + n, y + m] as Coord)
  }).flat().filter(([nbrX, nbrY]) => {
    return (nbrX !== x || nbrY !== y) // self
      && nbrX >= 0 && nbrX < width
      && nbrY >= 0 && nbrY < height;
  })
}

export function forEach<T>(grid: Grid<T>, fn: (t: T, index?: Coord) => void) {
  grid.forEach((row, y) => row.forEach((item, x) => fn(item, [x, y])));
}

export function map<T1, T2>(grid: Grid<T1>, fn: (item: T1, index?: Coord) => T2): Grid<T2> {
  return grid.map((row, y) => row.map((item, x) => fn(item, [x, y] as Coord)))
}

export function filter<T>(grid: Grid<T>, predicate: (item: T, index?: Coord) => boolean): [T, Coord][] {
  type Result = [[T, Coord], boolean]

  return map(grid, (item, index) => [[item, index as Coord], predicate(item, index)] as Result)
    .flat().filter(second).map(first)
}

export function copy<T>(grid: Grid<T>): Grid<T> {
  return map(grid, id);
}

export function values<T>(grid: Grid<T>): T[] {
  return grid.flat();
}