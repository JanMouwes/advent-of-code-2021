import { reduce } from './iterator';

export function plus(a: number, b: number) {
  return a + b;
}
export function mult(a: number, b: number) {
  return a * b;
}

export function sum(iter: Iterable<number>): number {
  return reduce(iter, plus, 0);
}

export function product(iter: Iterable<number>): number {
  return reduce(iter, mult, 0);
}

export function max<T>([head, ...rest]: Iterable<T>, fn: (item: T) => number): T {
  return rest.reduce((prev: T, curr: T) => {
    if (fn(prev) > fn(curr)) {
      return prev;
    }

    return curr;
  }, head);
}

export function min<T>(
  [head, ...rest]: readonly T[],
  fn: (item: T) => number
): T {
  return rest.reduce((prev: T, curr: T) => {
    if (fn(prev) < fn(curr)) {
      return prev;
    }

    return curr;
  }, head);
}
