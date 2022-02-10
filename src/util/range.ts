/**
 * Creates list of numbers from start to end.
 */
export function range(start: number, end?: number): number[] {
  if (end == null) {
    end = start;
    start = 0;
  }

  return new Array(end - start).fill(start).map((_, i) => start + i);
}
