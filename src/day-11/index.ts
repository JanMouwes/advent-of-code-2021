import {
  Grid as G,
  range,
  Set as S,
  List as L,
} from "../util/index";
import { second } from "../util/tuple";
import { lines } from '../util/string';

export const examples = {
  input: `5483143223
2745854711
5264556173
6141336146
6357385478
4167524645
2176841721
6882881134
4846848554
5283751526`,
  outputs: {
    part1: "1656",
    part2: "195",
  },
} as const;

export function part1(fileContents: string) {
  const parsed = parseInput(fileContents);

  return second(
    range(100).reduce(
      ([grid, count]: [G.Grid<number>, number]) => {
        const [newGrid, updates] = step(grid);
        return [newGrid, count + updates] as [G.Grid<number>, number];
      },
      [parsed, 0]
    )
  );
}

function coordEquals([x1, y1]: G.Coord, [x2, y2]: G.Coord) {
  return x1 === x2 && y1 === y2;
}

function step(grid: G.Grid<number>): [G.Grid<number>, number] {
  grid = G.copy(grid);

  let updates = 0;
  let targets = G.filter(grid, (_) => true).map(second);

  const flashed = new Set<string>([]);
  do {
    targets.forEach(([x, y]) => grid[y][x]++);

    const highs = G.filter(
      grid,
      (n, c) => n > 9 && !flashed.has(JSON.stringify(c))
    ).map(second);
    highs.forEach((f) => flashed.add(JSON.stringify(f)));

    updates += highs.length;

    const edges = highs.map((c) => G.neighbours(c, grid, true)).flat();

    targets = S.difference(edges, highs, coordEquals);
  } while (targets.length > 0);

  [...flashed.values()]
    .map((s) => JSON.parse(s))
    .forEach(([x, y]) => (grid[y][x] = 0));

  return [grid, updates];
}

export function part2(fileContents: string) {
  let grid: any = parseInput(fileContents);

  let counter = 0;
  while (L.uniques(G.values(grid)).length > 1) {
    counter++;
    [grid] = step(grid);
  }

  return counter;
}

function parseInput(input: string): G.Grid<number> {
  return lines(input).map((l) => l.split("").map(Number));
}
