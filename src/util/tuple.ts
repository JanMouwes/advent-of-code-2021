export type Tuple<A, B> = [A, B];
export type Triple<A, B, C> = [A, B, C];

export function first<T>([fst]: readonly [T, any]): T {
  return fst;
}
export function second<T>([, snd]: readonly [any, T]): T {
  return snd;
}
