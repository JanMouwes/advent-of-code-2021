export function sum(list: number[]): number {
  return list.reduce((x, y) => x + y, 0);
}

export function product(list: number[]): number {
  return list.reduce((x, y) => x * y, 1);
}

export function max<T>([head, ...rest]: T[], fn: (item: T) => number): T {
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
