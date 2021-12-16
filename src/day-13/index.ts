import { Tuple, second, equals } from "../util/tuple";
import { lines } from "../util/string";
import { Coord } from "../util/grid";
import { first, filterInOut, uniques, head } from "../util/list";
import { range } from "../util/range";

export const examples = {
  input: `6,10
0,14
9,10
0,3
10,4
4,11
6,0
6,12
4,1
0,13
10,12
3,4
3,0
8,4
1,10
2,14
8,10
9,0

fold along y=7
fold along x=5`,
  outputs: {
    part1: "17",
    part2: undefined,
  },
} as const;

export function part1(fileContents: string) {
  const [dots, instructions] = parseInput(fileContents);

  const folded = fold(dots, first(instructions));

  return folded.length;
}

function fold(dots: Coord[], [axis, value]: Instruction): Coord[] {
  const index = axis === "x" ? 0 : 1;

  function moveDot(dot: Coord) {
    const copy: [number, number] = [...dot];

    copy[index] = dot[index] - 2 * (dot[index] - value);

    return copy as Coord;
  }

  const [firstHalf, secondHalf] = filterInOut(
    dots,
    (dot) => dot[index] < value
  );

  return uniques(firstHalf.concat(secondHalf.map(moveDot)));
}

function toString(dots: Coord[], [width, height]: readonly [number, number]) {
  const contains = (target: Coord) => dots.find((dot) => equals(dot, target));

  return range(height)
    .map((y) =>
      range(width)
        .map((x) => (contains([x, y]) ? "#" : "."))
        .join("")
    )
    .join("\n");
}

export function part2(fileContents: string) {
  const [dots, instructions] = parseInput(fileContents);

  const result = instructions.reduce(fold, dots);

  const [xs, ys] = filterInOut(instructions, ([ax]) => ax === "x");
  const size: [number, number] = [
    Math.min(...xs.map(second)),
    Math.min(...ys.map(second)),
  ];

  return toString(result, size);
}

type Axis = "x" | "y";
type Instruction = Tuple<Axis, number>;

function parseInput(input: string): [Coord[], Instruction[]] {
  const [dots, instrs] = input.split("\n\n");

  return [
    lines(dots).map((s) => s.split(",").map(Number) as [number, number]),
    lines(instrs).map((s) => {
      const [str, value] = s.split("=");

      const axis = str.substring(str.length - 1);

      return [axis, Number(value)] as Instruction;
    }),
  ];
}
