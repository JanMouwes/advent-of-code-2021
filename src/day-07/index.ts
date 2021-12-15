import { range } from "../util";
import { sum } from "../util/maths";

export const examples = {
  input: "16,1,2,0,4,2,7,1,2,14",
  outputs: {
    part1: "37",
    part2: "168",
  },
} as const;

export function part1(fileContents: string) {
  const parsed: number[] = parseInput(fileContents);

  const totalDists = calculateTotalFuelCosts(
    parsed,
    calculateLinearFuelCostForCrab
  );
  totalDists.sort(([, a], [, b]) => a - b);

  return totalDists[0][1];
}

export function part2(fileContents: string) {
  const parsed: number[] = parseInput(fileContents);

  const totalDists = calculateTotalFuelCosts(
    parsed,
    calculateRisingFuelCostForCrab
  );
  totalDists.sort(([, a], [, b]) => a - b);

  return totalDists[0][1];
}

function calculateLinearFuelCostForCrab(crab: number, target: number): number {
  return Math.abs(target - crab);
}

function calculateRisingFuelCostForCrab(crab: number, target: number): number {
  const dist = Math.abs(target - crab);

  if (dist === 0) {
    return 0;
  }

  // y = (x^2) - ((x^2 - x) / 2)
  const squared = Math.pow(dist, 2);
  return squared - (squared - dist) / 2;
}

function calculateTotalFuelCosts(
  crabPositions: number[],
  calculateFuelForCrab: (n: number, m: number) => number
) {
  const max = Math.max(...crabPositions);
  const min = Math.min(...crabPositions);

  const numberRange = max - min;

  return range(numberRange).map((target) => [
    target,
    sum(crabPositions.map((crab) => calculateFuelForCrab(crab, target))),
  ]);
}

function parseInput(input: string): number[] {
  return input.split(",").map(Number);
}
