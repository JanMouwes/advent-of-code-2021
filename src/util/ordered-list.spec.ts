import { insert, OrderedList } from "./ordered-list";

describe(insert.name, () => {
  const inputs: [OrderedList<number>, number, OrderedList<number>][] = [
    [[], 1, [1]],
    [[1, 2, 4], 3, [1, 2, 3, 4]],
    [[2, 3, 4], 1, [1, 2, 3, 4]],
    [[1, 2, 3], 4, [1, 2, 3, 4]],
  ];

  inputs.forEach(([list, num, expected]) => {
    it("should return the correct list", () => {
      const actual = insert(list, num, (a, b) => a - b);

      expect(actual).toEqual(expected);
    });
  });
});
