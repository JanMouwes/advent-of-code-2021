export function sum(list: number[]): number {
  return list.reduce((x, y) => x + y, 0);
}

export function product(list: number[]): number {
  return list.reduce((x, y) => x * y, 1);
}
