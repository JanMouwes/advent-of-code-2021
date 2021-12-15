export function id<T>(input: T): T {
  return input;
}

export function uncurry<T1, T2, T3>(
  fn: (a: T1, b: T2) => T3
): (input: [T1, T2]) => T3 {
  return ([a, b]) => fn(a, b);
}

export function not<T>(fn: (i: T) => boolean): (i: T) => boolean {
  return (i) => !fn(i);
}
