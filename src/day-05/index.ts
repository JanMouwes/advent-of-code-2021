import { range, uncurry } from "../util";

type CoordsMap = Map<SerialisedCoords, number>;

export const examples = {
  input:
    "0,9 -> 5,9\n8,0 -> 0,8\n9,4 -> 3,4\n2,2 -> 2,1\n7,0 -> 7,4\n6,4 -> 2,0\n0,9 -> 2,9\n3,4 -> 1,4\n0,0 -> 8,8\n5,5 -> 8,2",
  outputs: {
    part1: "5",
    part2: "12",
  },
} as const;

export function part1(fileContents: string) {
  const parsed: CoordsList = parseInput(fileContents).filter(
    uncurry(([x1, y1], [x2, y2]) => x1 === x2 || y1 === y2)
  );
  return [...calculateCoordsMap(parsed).values()].filter((n) => n > 1).length;
}

export function part2(fileContents: string) {
  const parsed: CoordsList = parseInput(fileContents);
  return [...calculateCoordsMap(parsed).values()].filter((n) => n > 1).length;
}

function calculateCoordsMap(coordsMap: CoordsList): CoordsMap {
  const coordsList = coordsMap.map(uncurry(getLines)).flat();

  return coordsList.reduce<CoordsMap>((map: CoordsMap, coords: Coords) => {
    const serialised = serialiseCoordinates(coords);

    if (!map.has(serialised)) {
      map.set(serialised, 1);

      return map;
    }

    map.set(serialised, map.get(serialised)! + 1);

    return map;
  }, new Map<SerialisedCoords, number>() as CoordsMap);
}

function getLines([x1, y1]: Coords, [x2, y2]: Coords): Coords[] {
  const xRange = Math.abs(x2 - x1) + 1;
  const yRange = Math.abs(y2 - y1) + 1;

  const [xDelta, yDelta] = [getDirection(x1, x2), getDirection(y1, y2)];

  return range(Math.max(xRange, yRange)).map((n) => [
    x1 + xDelta * n,
    y1 + yDelta * n,
  ]);
}

function getDirection(a: number, b: number): -1 | 0 | 1 {
  if (a < b) {
    return 1;
  } else if (a > b) {
    return -1;
  }

  return 0;
}

function parseInput(input: string): CoordsList {
  return input
    .split("\n")
    .filter((s) => s.trim() !== "")
    .map((line) => line.split(" -> ") as [SerialisedCoords, SerialisedCoords])
    .map(([start, end]) => [parseCoordinates(start), parseCoordinates(end)]);
}

type SerialisedCoords = `${number},${number}`;

type Coords = [number, number];
type CoordsList = [Coords, Coords][];

function parseCoordinates(input: SerialisedCoords): Coords {
  const [x, y] = input.split(",").map(Number);
  return [x, y];
}

function serialiseCoordinates([x, y]: Coords): SerialisedCoords {
  return `${x},${y}`;
}
