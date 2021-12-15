import { lines } from '../util/string';
import { uniques, partition, filterInOut, concat, count } from '../util/list';
import { first, second } from '../util/tuple';
import { id } from '../util/fn';

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
  const connections = parsed.concat(parsed.map(([a, b]) => [b, a]))

  const allCaves = uniques(connections.map(first).concat(connections.map(second)))
  const [smallCaves,] = filterInOut(allCaves, cave => cave.toLowerCase() === cave)

  const graph = new Map([...partition(connections, first).entries()].map(([start, paths]) => [start, new Set(paths.map(second))]));

  function findPaths(path: string[], graph: Graph<string>): string[][] {
    const [head, ...currentPath] = path;

    if (head === "end") {
      return [path];
    }

    const edges = graph.get(head) || [];

    return [...edges].map(edge => {
      if (smallCaves.includes(edge) && currentPath?.includes(edge)) { return []; }

      return findPaths([edge, head, ...currentPath], graph);
    }).flat()
  }

  const paths = findPaths(["start"], graph);

  return paths.length;

}

type Graph<T> = Map<T, Set<T>>;

export function part2(fileContents: string) {
  const parsed = parseInput(fileContents);
  const connections = parsed.concat(parsed.map(([a, b]) => [b, a]))

  const allCaves = uniques(connections.map(first).concat(connections.map(second)))
  const [smallCaves] = filterInOut(allCaves, cave => cave.toLowerCase() === cave);

  const graph = new Map([...partition(connections, first).entries()].map(([start, paths]) => [start, new Set(paths.map(second))]));

  function findPaths(path: string[], graph: Graph<string>): string[][] {
    const [head] = path;

    if (head === "end") {
      return [path];
    }

    const edges = graph.get(head) || [];

    return [...edges].map(edge => {
      const isSecondVisit = path.includes(edge);
      if (["start", "end"].includes(edge) && isSecondVisit) {
        return [];
      }

      function countSmallCaves() {
        const cnts = count(path.filter(x => smallCaves.includes(x)), id);        
        return Math.max(...cnts.values());
      }
      
      if (smallCaves.includes(edge) && isSecondVisit && countSmallCaves() > 1) { return []; }

      return findPaths([edge, ...path], graph);
    }).flat()
  }

  const paths = findPaths(["start"], graph);

  return paths.length;
}

function parseInput(input: string): [string, string][] {
  return lines(input).map(line => line.split("-") as [string, string]);
}
