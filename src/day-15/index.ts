import { lines } from '../util/string';
import { fromGrid, Path, findPath } from '../util/graph';
import { Coord, Grid, toString, map, fromString, size } from '../util/grid';
import { Tuple, equals, first } from '../util/tuple';
import { List as L } from '../util';
import { sum } from '../util/maths';
import "colorts/lib/string";
import { range } from '../util/range';

export const examples = {
  input: `1163751742
1381373672
2136511328
3694931569
7463417111
1319128137
1359912421
3125421639
1293138521
2311944581`,
  outputs: {
    part1: "40",
    part2: "315",
  },
} as const;

export function part1(fileContents: string) {
  const grid = parseInput(fileContents);
  const graph = fromGrid(grid, (_, [v]) => v);

  const bottomRight: Tuple<number, number> = (([x, y]) => [x - 1, y - 1])(size(grid));

  const start = L.first(graph);
  const end = graph.find(([[, c]]) => equals(c, bottomRight))!;

  const path = findPath(start, end);

  const values: number[] = path.map(([[[value]]]) => value);

  return sum(values) - first(first(start));
}

function showPath<T>(grid: Grid<T>, path: Path<Tuple<any, Coord>>) {
  const strGrid = fromString(toString(grid, ""), "");

  const coords: Coord[] = path.map(([[[, coord]]]) => coord)

  const newGrid = map(strGrid, (i, c) => coords.find((c2) => equals(c, c2)) ? i.green : i)

  return toString(newGrid, "");
}

export function part2(fileContents: string) {
  const grid = toString(repeatGrid(parseInput(fileContents)), "");

  return part1(grid)
}

function repeatGrid(original: Grid<number>): Grid<number> {
  const grids = range(5).map((y) => {
    return range(5).map(x => map(original, (n) => (n + x + y - 1) % 9 + 1))
  })

  return grids.map(([head, ...gridRow]) => {
    return gridRow.reduce((current, grid) => grid.map((row, i) => [...current[i], ...row]), [...head]);
  }).flat()
}

function parseInput(input: string): Grid<number> {
  return lines(input).map((l) => l.split("").map(Number));
}
