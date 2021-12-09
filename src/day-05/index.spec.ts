import { part1, part2, examples } from ".";

describe("part 1", () => {
  it("should give expected output", async () => {
    await testPart(part1, examples.input, examples.outputs.part1);
  });
});

describe("part 1", () => {
  it("part 2 should give expected output", async () => {
    await testPart(part2, examples.input, examples.outputs.part2);
  });
});

async function testPart(fn: Function, input?: string, output?: string) {
  if (input == null || output == null) {
    return;
  }

  await testFunction(fn, input, output);
}

async function testFunction(fn: Function, input: string, output: string) {
  const actual = (await fn(input)).toString();

  expect(actual).toBe(output);
}
