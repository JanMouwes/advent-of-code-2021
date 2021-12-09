import { range } from "../util";

export const examples = {
  input: `00100
  11110
  10110
  10111
  10101
  01111
  00111
  11100
  10000
  11001
  00010
  01010`,
  outputs: {
    part1: "198",
    part2: "230",
  },
} as const;

export function part1(fileContents: string) {
  const [numbers, width]: [number[], number] = parseInput(fileContents);

  const mask = Number.parseInt("".padEnd(width, "1"), 2);

  const gamma = calculateGamma(numbers, width);
  const epsilon = gamma ^ mask;

  return gamma * epsilon;
}

function calculateGamma(input: number[], width: number) {
  const masks = new Array(width).fill(2).map((n, i) => Math.pow(n, i));

  return masks
    .map((mask) => {
      const moreOnes =
        input.map((n) => n & mask).filter((n) => n > 0).length >
        input.length / 2;

      return moreOnes ? mask : 0;
    })
    .reduce((x, y) => x + y, 0);
}

export function part2(fileContents: string) {
  const [numbers, width]: [number[], number] = parseInput(fileContents);

  const oxygen = calculateRating(numbers, width, toOxygenBit);
  const co2 = calculateRating(numbers, width, toCO2Bit);

  return co2 * oxygen;
}

function calculateRating(
  allNumbers: number[],
  width: number,
  toBit: (res: CompResult) => Bit
): number {
  let result = "";

  return range(width).reduce((input: number[], i: number) => {
    if (input.length === 1) {
      return input;
    }

    result += toBit(compareOnes(input, width, i));

    return input.filter((n) => toBinaryString(n, width).startsWith(result));
  }, allNumbers)[0];
}

type CompResult = "equal" | "greater" | "less";
type Bit = 0 | 1;

function toOxygenBit(result: CompResult): Bit {
  return toBitBase(result, 1, 1, 0);
}

function toCO2Bit(result: CompResult): Bit {
  return toBitBase(result, 0, 0, 1);
}

function toBitBase(result: CompResult, eq: Bit, gt: Bit, lt: Bit): Bit {
  switch (result) {
    case "equal":
      return eq;
    case "greater":
      return gt;
    case "less":
      return lt;
  }
}

function compareOnes(
  input: number[],
  width: number,
  position: number
): CompResult {
  const oneCount = input
    .map((n) => {
      return toBinaryString(n, width)[position];
    })
    .filter((n) => n === "1").length;

  const threshold = input.length / 2;

  if (threshold === oneCount) {
    return "equal";
  }

  return oneCount > threshold ? "greater" : "less";
}

function toBinaryString(n: number, padding: number) {
  return n.toString(2).padStart(padding, "0");
}

function parseInput(commands: string): [number[], number] {
  const split = commands.split("\n").filter((i) => i.trim() != "");

  return [split.map((n) => Number.parseInt(n, 2)), split[0].length];
}
