import { not } from "./fn";
import * as Set from "./set";

export function isWhitespace(str: string): boolean {
  return str.trim() === "";
}

export function lines(input: string): string[] {
  return input.split("\n").filter(not(isWhitespace));
}

export function words(input: string): string[] {
  return input.split(" ").filter(not(isWhitespace));
}

export function intersect(as: string, bs: string): string[] {
  return Set.intersect(as.split(""), bs.split(""));
}

/**
 * should be strDisjunction
 */
export function disjunction(as: string, bs: string): string[] {
  return Set.disjunction(as.split(""), bs.split(""));
}
