import { lines } from "../util/string";
import { uniques, partition, filterInOut, concat, count } from "../util/list";
import { first, second } from "../util/tuple";
import { id } from "../util/fn";

export const examples = {
  input: `fs-end
he-DX
fs-he
start-DX
pj-DX
end-zg
zg-sl
zg-pj
pj-he
RW-he
fs-DX
pj-RW
zg-RW
start-pj
he-WI
zg-he
pj-fs
start-RW`,
  outputs: {
    part1: "226",
    part2: "3509",
  },
} as const;

export function part1(fileContents: string) {
  const parsed = parseInput(fileContents);
  const connections = parsed.concat(parsed.map(([a, b]) => [b, a]));

  const allCaves = uniques(
    connections.map(first).concat(connections.map(second))
  );
  const smallCaves = new Set(
    first(filterInOut(allCaves, (cave) => cave.toLowerCase() === cave))
  );

  const graph = new Map(
    [...partition(connections, first).entries()].map(([start, paths]) => [
      start,
      uniques(paths.map(second)),
    ])
  );

  function findPaths(path: string[]): string[][] {
    const [head] = path;

    if (head === "end") {
      return [path];
    }

    const edges = graph.get(head) || [];

    return edges
      .filter((edge) => !smallCaves.has(edge) || !path.includes(edge))
      .map((edge) => findPaths([edge].concat(path)))
      .flat();
  }

  const paths = findPaths(["start"]);

  return paths.length;
}

export function part2(fileContents: string) {
  const parsed = parseInput(fileContents);
  const connections = parsed.concat(parsed.map(([a, b]) => [b, a]));

  const allCaves = uniques(
    connections.map(first).concat(connections.map(second))
  );
  const smallCaves = new Set(
    first(filterInOut(allCaves, (cave) => cave.toLowerCase() === cave))
  );

  const graph = new Map(
    [...partition(connections, first).entries()].map(([start, paths]) => [
      start,
      uniques(paths.map(second)),
    ])
  );

  function findPaths(path: string[]): string[][] {
    const [head] = path;

    if (head === "end") {
      return [path];
    }

    const edges = graph.get(head) || [];

    return edges
      .filter((edge) => {
        if (["start", "end"].includes(edge) && path.includes(edge)) {
          return false;
        }

        function countSmallCaves(): number {
          const cnts = count(
            path.filter((x) => smallCaves.has(x)),
            id
          ).values();
          return Math.max(...cnts);
        }

        return !(
          smallCaves.has(edge) &&
          path.includes(edge) &&
          countSmallCaves() > 1
        );
      })
      .map((edge) => findPaths([edge].concat(path)))
      .flat();
  }

  const paths = findPaths(["start"]);

  return paths.length;
}

function parseInput(input: string): [string, string][] {
  return lines(input).map((line) => line.split("-") as [string, string]);
}
