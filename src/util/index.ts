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

  list.forEach(item => {
    const k = fn(item);

    if (!map.has(k)) {
      map.set(k, []);
    }

    map.get(k)!.push(item);
  })

  return map;
}

export function uncurry<T1, T2, T3>(fn: (a: T1, b: T2) => T3): (input: [T1, T2]) => T3 {
  return ([a, b]) => fn(a, b);
}