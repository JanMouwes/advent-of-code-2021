import { Predicate, Fn, constant } from './fn';
import { sum } from './maths';

export function find<T>(iter: Iterable<T>, predicate: Predicate<T>) {
  for (const value of iter) {
    if (predicate(value)) {
      return value;
    }
  }
}
export function reduce<T, R>(iter: Iterable<T>, fn: (r: R, t: T) => R, r: R) {
  for (const item of iter) {
    r = fn(r, item);
  }

  return r;
}

export function* map<T, R>(iter: Iterable<T>, fn: Fn<T, R>): Iterable<R> {
  for (const item of iter) {
    yield fn(item);
  }
}

export function count<T>(iter: Iterable<T>): number {
  return sum(map(iter, constant(1)));
}