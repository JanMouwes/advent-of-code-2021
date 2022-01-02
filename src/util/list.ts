import { not, Predicate } from "./fn";

export function uniques<T>(list: readonly T[]): T[] {
  return [...new Set<string>(list.map((v) => JSON.stringify(v)))].map((v) =>
    JSON.parse(v)
  );
}

export function partition<T, K>(list: T[], fn: (item: T) => K): Map<K, T[]> {
  const map = new Map<K, T[]>();

  list.forEach((item) => {
    const k = fn(item);

    if (!map.has(k)) {
      map.set(k, []);
    }

    map.get(k)!.push(item);
  });

  return map;
}

export function count<T, K>(array: T[], fn: (item: T) => K): Map<K, number> {
  return array.reduce((map, item) => {
    const key = fn(item);

    if (!map.has(key)) {
      return map.set(key, 1);
    }

    const current = map.get(key)!;
    return map.set(key, current + 1);
  }, new Map<K, number>());
}

export function filterInOut<T>(list: T[], fn: (i: T) => boolean): [T[], T[]] {
  const yes = list.filter(fn);
  const no = list.filter(not(fn));

  return [yes, no];
}

export function take<T>(list: T[], n: number) {
  return list.slice(0, n);
}

export function drop<T>(list: T[], n: number) {
  return list.slice(n);
}

export function head<T>(list: readonly T[], n: number): T[] {
  return list.slice(0, n);
}

export function tail<T>(list: readonly T[], n: number): T[] {
  return list.slice(list.length - n, list.length);
}

export function first<T>(list: readonly T[]): T {
  return list[0];
}

export function last<T>(list: readonly T[]): T {
  return list[list.length - 1];
}

export function middle<T>(list: readonly T[]): T {
  return list[(list.length - 1) / 2];
}

export function concat<T>(lists: readonly T[][]): T[] {
  return lists.reduce((agg, curr) => agg.concat(curr), []);
}
