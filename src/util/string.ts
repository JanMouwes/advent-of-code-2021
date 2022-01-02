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

export function disjunction(as: string, bs: string): string[] {
  return Set.disjunction(as.split(""), bs.split(""));
}

/**
 * Chops string into even parts.
 * @param str 
 * @param bitSize 
 */
export function* chop(str: string, bitSize: number): Generator<string, void, unknown> {
  while (str.length > 0) {
    yield str.substring(0, bitSize);
    str = str.substring(bitSize);
  }
}