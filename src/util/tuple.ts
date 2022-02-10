export type Tuple<A, B = A> = readonly [A, B];
export type Triple<A, B = A, C = B> = readonly [A, B, C];

export function first<T>([fst]: Tuple<T, any>): T {
  return fst;
}
export function second<T>([, snd]: Tuple<any, T>): T {
  return snd;
}

export function equals<T1, T2>(
  [a1, b1]: Tuple<T1, T2>,
  [a2, b2]: Tuple<T1, T2>
) {
  return a1 === a2 && b1 === b2;
}
