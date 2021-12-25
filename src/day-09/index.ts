import { sum, product } from "../util/maths";
import { lines } from "../util/string";
import { concat } from "../util/list";
import { second } from "../util/tuple";

export const examples = {
  input: `2199943210
3987894921
9856789892
8767896789
9899965678`,
  outputs: {
    part1: "15",
    part2: "0",
  },
} as const;

export function part1(fileContents: string) {
  const grid: Grid = parseInput(fileContents);

  const lows = findLows(grid);

  return sum(lows.map((c) => valueOf(c, grid) + 1));
}

export function part2(fileContents: string) {
  const grid: any = parseInput(fileContents);

  const lows = findLows(grid);

  const basins = lows.map((l) => findBasin(l, grid));

  return product(
    basins
      .map((b) => b.length)
      .sort((a, b) => a - b)
      .reverse()
      .slice(0, 3)
  );
}

function findLows(grid: Grid): Coord[] {
  return flatWithCoords(grid)
    .filter(([value, coord]) => {
      return neighbours(coord, grid).every((nbr) => valueOf(nbr, grid) > value);
    })
    .map(second);
}

function flatWithCoords(grid: Grid): [number, Coord][] {
  return concat(grid.map((row, y) => row.map((col, x) => [col, [x, y]])));
}

function findBasin(start: Coord, grid: Grid): Coord[] {
  const basin = new Set<Coord>();
  const found = new Set<string>();
  let queue: Coord[] = [start];

  while (queue.length > 0) {
    const current = queue.shift()!;
    const [x, y] = current;
    const str = `(${x},${y})`;

    if (found.has(str) || valueOf(current, grid) === 9) {
      continue;
    }

    basin.add(current);
    found.add(str);

    queue = queue.concat(neighbours(current, grid));
  }

  return [...basin];
}

type Grid = number[][];
type Coord = [number, number];

function valueOf([x, y]: Coord, grid: Grid) {
  return grid[y][x];
}

function neighbours([x, y]: Coord, grid: Grid): Coord[] {
  const nbrs: Coord[] = [];

  if (x > 0) {
    nbrs.push([x - 1, y]);
  }
  if (x + 1 < grid[0].length) {
    nbrs.push([x + 1, y]);
  }
  if (y > 0) {
    nbrs.push([x, y - 1]);
  }
  if (y + 1 < grid.length) {
    nbrs.push([x, y + 1]);
  }

  return nbrs;
}

function parseInput(input: string): number[][] {
  const ls = lines(input);

  return ls.map((l) => l.split("")).map((ns) => ns.map(Number));
}
