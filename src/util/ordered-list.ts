import { Fn2 } from "./fn";
export type OrderedList<T> = T[];

export function insert<T>(
  list: OrderedList<T>,
  item: T,
  compare: Fn2<T, T, number>
): OrderedList<T> {
  const index = list.findIndex((el) => compare(item, el) < 0);

  if (index < 0) {
    return [...list, item];
  }

  return [...list.slice(0, index), item, ...list.slice(index)];
}
