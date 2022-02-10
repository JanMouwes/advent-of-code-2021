import { Tuple } from "./tuple";

export function isBetween(n: number, [min, max]: Tuple<number>) {
  return n > min && n < max;
}
