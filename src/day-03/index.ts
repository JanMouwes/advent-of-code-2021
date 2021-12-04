import { range } from "../util";

const INPUT_WIDTH = 12;

export function part1(fileContents: string) {
  const numbers: number[] = parseInput(fileContents);

  const mask = Number.parseInt("".padEnd(INPUT_WIDTH, "1"), 2);

  const gamma = calculateGamma(numbers);
  const epsilon = gamma ^ mask;

  return gamma * epsilon;
}

function calculateGamma(input: number[]) {
  const masks = new Array(INPUT_WIDTH).fill(2).map((n, i) => Math.pow(n, i));

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
  const numbers: number[] = parseInput(fileContents);

  const oxygen = calculateRating(numbers, toOxygenBit);
  const co2 = calculateRating(numbers, toCO2Bit);

  return co2 * oxygen;
}

function calculateRating(
  allNumbers: number[],
  toBit: (res: CompResult) => Bit
): number {
  let result = "";

  return range(INPUT_WIDTH).reduce((input: number[], i: number) => {
    if (input.length === 1) {
      return input;
    }

    result += toBit(compareOnes(input, i));

    return input.filter((n) => toBinaryString(n).startsWith(result));
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

function compareOnes(input: number[], position: number): CompResult {
  const oneCount = input
    .map((n) => {
      return toBinaryString(n)[position];
    })
    .filter((n) => n === "1").length;

  const threshold = input.length / 2;

  if (threshold === oneCount) {
    return "equal";
  }

  return oneCount > threshold ? "greater" : "less";
}

function toBinaryString(n: number, padding: number = INPUT_WIDTH) {
  return n.toString(2).padStart(padding, "0");
}

function parseInput(commands: string): number[] {
  return commands
    .split("\n")
    .filter((i) => i.trim() != "")
    .map((n) => Number.parseInt(n, 2));
}
