export function union<T>(as: readonly T[], bs: readonly T[]): T[] {
  return as.concat(bs);
}

const stdEq = (a: any, b: any) => a === b;

export function intersect<T>(
  as: readonly T[],
  bs: readonly T[],
  eq: (a: T, b: T) => boolean = stdEq
): T[] {
  return as.filter((a) => !!bs.find((b) => eq(a, b)));
}

export function disjunction<T>(
  as: readonly T[],
  bs: readonly T[],
  eq: (a: T, b: T) => boolean = stdEq
): T[] {
  return difference(as, bs, eq).concat(difference(bs, as, eq));
}

export function difference<T>(
  as: readonly T[],
  bs: readonly T[],
  eq: (a: T, b: T) => boolean = stdEq
): T[] {
  return as.filter((a) => bs.find((b) => eq(a, b)) === undefined);
}
