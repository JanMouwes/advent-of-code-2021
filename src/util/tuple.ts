export type Tuple<A, B> = readonly [A, B];
export type Triple<A, B, C> = readonly [A, B, C];

export function first<T>([fst]: Tuple<T, any>): T {
  return fst;
}
export function second<T>([, snd]: Tuple<any, T>): T {
  return snd;
}
