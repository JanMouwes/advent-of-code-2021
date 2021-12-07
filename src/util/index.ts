export function range(start: number, end?: number): number[] {
  if (end == null) {
    end = start;
    start = 0;
  }

  return new Array(end - start).fill(start).map((_, i) => start + i);
}

export function transpose<T>(matrix: T[][]) {
  const rowLength = matrix[0].length;

  return range(rowLength).map((i) => matrix.map((row) => row[i]));
}

export function id<T>(input: T): T {
  return input;
}

export function second<T>([, snd]: [any, T]): T {
  return snd;
}

export function sum(list: number[]) {
  return list.reduce((x, y) => x + y);
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

export function uncurry<T1, T2, T3>(
  fn: (a: T1, b: T2) => T3
): (input: [T1, T2]) => T3 {
  return ([a, b]) => fn(a, b);
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

export function not<T>(fn: (i: T) => boolean): (i: T) => boolean {
  return (i) => !fn(i);
}

export function filterInOut<T>(list: T[], fn: (i: T) => boolean): [T[], T[]] {
  const yes = list.filter(fn);
  const no = list.filter(not(fn));

  return [yes, no];
}

export function lines(input: string): string[] {
  return input.split("\n")
}