export function testFnIO<In extends readonly any[], Out>(
  cases: [In, Out][],
  fn: (...input: In) => Out,
  description: string = ""
) {
  cases.forEach(([args, expected]) => {
    it(description, () => {
      const actual = fn(...args);

      expect(actual).toEqual(expected);
    });
  });
}
