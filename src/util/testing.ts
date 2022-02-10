import { Tuple } from "./tuple";

type Case<In extends readonly any[], Out> = Tuple<In, Out> | { args: In, expected: Out }

export function testFnIO<In extends readonly any[], Out>(
  cases: { args: In, expected: Out }[],
  fn: (...input: In) => Out,
  description?: string
): void;

export function testFnIO<In extends readonly any[], Out>(
  cases: Tuple<In, Out>[],
  fn: (...input: In) => Out,
  description?: string
): void;

export function testFnIO<In extends readonly any[], Out>(
  cases: Case<In, Out>[],
  fn: (...input: In) => Out,
  description?: string
) {
  cases.map((c: Case<In, Out>) => {
    if ("args" in c) {
      return [c.args, c.expected] as [In, Out]
    }

    return c;
  }).forEach(([args, expected]) => {
    const descr = description || `(${args.join(", ")}) -> ${expected}`

    it(descr, () => {
      const actual = fn(...args);

      expect(actual).toEqual(expected);
    });
  });
}
