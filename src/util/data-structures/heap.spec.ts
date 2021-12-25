import { Heap } from "./heap";

describe(Heap.name, () => {
  describe("e2e", () => {
    let heap: Heap<number>;
    beforeEach(() => {
      heap = new Heap<number>((a, b) => a - b);
    });

    const inputs: [number[], number[]][] = [
      [
        [1, 2, 3, 4],
        [1, 2, 3, 4],
      ],
      [
        [4, 2, 3, 1],
        [1, 2, 3, 4],
      ],
      [
        [4, 1, 2, 3],
        [1, 2, 3, 4],
      ],
      [
        [4, 3, 2, 1],
        [1, 2, 3, 4],
      ],
    ];

    inputs.forEach(([input, expected]) => {
      it(`should return ${expected} for ${input}`, () => {
        input.forEach(heap.insert.bind(heap));

        const actual = [];

        while (heap.size > 0) {
          actual.push(heap.pop());
        }

        expect(actual.toString()).toEqual(expected.toString());
        expect(actual).toEqual(expected);
      });
    });
  });
});
