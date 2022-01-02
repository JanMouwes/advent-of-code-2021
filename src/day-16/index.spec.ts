import { part1, part2, examples, parseLiteral, Literal, parse } from ".";
import { testFnIO } from "../util/testing";
import { evalPacket } from './index';

describe("part 1", () => {
  it("should give expected output", async () => {
    await testPart(part1, examples.input, examples.outputs.part1);
  });
});

describe("part 2", () => {
  it("should give expected output", async () => {
    await testPart(part2, examples.input, examples.outputs.part2);
  });
});

describe(parseLiteral.name, () => {
  it("should return the correct literal", () => {
    const input = "110100101111111000101000";

    const [actualLiteral, actualRest] = parseLiteral(input);
    const expected: Literal = { version: 6, typeId: 4, type: "literal", value: 2021 }

    expect(actualRest).toEqual("000");
    expect(actualLiteral).toEqual(expected);
  })
})

describe(evalPacket.name, () => {
  testFnIO([
    [["C200B40A82"], 3],
    [["04005AC33890"], 54],
    [["880086C3E88112"], 7],
    [["CE00C43D881120"], 9],
    [["D8005AC2A8F0"], 1],
    [["F600BC2D8F"], 0],
    [["9C005AC2F8F0"], 0],
    [["9C0141080250320F1802104A08"], 1],
  ], (input) => {
    const parsed = input.split("");
    const bitString = parsed.map(c => Number.parseInt(c, 16).toString(2).padStart(4, "0")).join("")

    const packet = parse(bitString);

    return evalPacket(packet);
  })
})

async function testPart(fn: Function, input?: string, output?: string) {
  if (input == null || output == null) {
    return;
  }

  await testFunction(fn, input, output);
}

async function testFunction(fn: Function, input: string, output: string) {
  const actual = (await fn(input))?.toString();

  expect(actual || "").toBe(output);
}
