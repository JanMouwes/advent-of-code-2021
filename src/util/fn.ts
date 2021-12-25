export type Fn<T, R> = (val: T) => R;
export type Fn1<T, R> = Fn<T, R>;
export type Fn2<T1, T2, R> = (val: T1, val2: T2) => R;
export type Predicate<T> = Fn<T, boolean>;

export function id<T>(input: T): T {
  return input;
}

export function constant<T>(value: T): () => T {
  return () => value;
}

export function uncurry<T1, T2, T3>(
  fn: (a: T1, b: T2) => T3
): (input: [T1, T2]) => T3 {
  return ([a, b]) => fn(a, b);
}

export function not<T>(fn: (i: T) => boolean): (i: T) => boolean {
  return (i) => !fn(i);
}
