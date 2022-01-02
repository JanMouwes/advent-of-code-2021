import * as Str from "../util/string";
import * as I from "../util/iterable";
import { Fn } from "../util/fn";
import { sum, product } from "../util/maths";
export const examples = {
  input: `620080001611562C8802118E34`,
  outputs: {
    part1: "12",
    part2: undefined,
  },
} as const;

type BasePacket = { version: number; typeId: number };
export type Operator = BasePacket & { type: "operator"; subpackets: Packet[] };
export type Literal = BasePacket & { type: "literal"; value: number };
export type Packet = Literal | Operator;

export function part1(fileContents: string) {
  const parsed = parseInput(fileContents);
  const bitString = parsed
    .map((c) => Number.parseInt(c, 16).toString(2).padStart(4, "0"))
    .join("");

  const packet = parse(bitString);

  return flatten(packet).reduce((cur, { version }) => cur + version, 0);
}

function flatten(packet: Packet): Packet[] {
  if (packet.type === "literal") {
    return [packet];
  }

  return [packet as Packet].concat(packet.subpackets.map(flatten).flat());
}

export function parse(bitString: string): Packet {
  const [packet] = parsePacket(bitString);

  return packet;
}

function parseStart(
  bitString: string
): [{ version: number; typeId: number }, string] {
  const version = Number.parseInt(bitString.substring(0, 3), 2);
  const typeId = Number.parseInt(bitString.substring(3, 6), 2);

  return [{ version, typeId }, bitString.substring(6)];
}

function parsePacket(bitString: string): [Packet, string] {
  const [{ typeId }] = parseStart(bitString);
  const type = typeId === 4 ? "literal" : "operator";

  if (type === "operator") {
    return parseOperator(bitString);
  }

  return parseLiteral(bitString);
}

export function parseLiteral(bitString: string): [Literal, string] {
  const [{ version, typeId }, body] = parseStart(bitString);

  const windows = [...Str.chop(body, 5)];

  const valueParts = [
    ...I.takeWhile(windows, (s: string) => s.startsWith("1")),
    [...windows].find((s) => s.startsWith("0"))!,
  ];

  const valueBits = valueParts.map((s: string) => s.substring(1)).join("");

  const value = Number.parseInt(valueBits, 2);
  const valueRest = body.substring(valueParts.join("").length);

  const base = { version, typeId, type: "literal" } as const;
  return [{ ...base, value }, valueRest];
}

function parseOperator(bitString: string): [Operator, string] {
  const [{ version, typeId }, body] = parseStart(bitString);

  const lengthValue = body.startsWith("0") ? 15 : 11;
  const lengthEnd = 1 + lengthValue;
  const subpacketLength = Number.parseInt(body.substring(1, lengthEnd), 2);
  const packetEnd = lengthEnd + subpacketLength;

  const subpackets: Packet[] = [];
  let rest = body.substring(lengthEnd);
  let packet;

  if (lengthValue === 15) {
    rest = body.substring(lengthEnd, packetEnd);
  }

  while (
    rest.length > 0 &&
    (lengthValue !== 11 || subpacketLength > subpackets.length)
  ) {
    [packet, rest] = parsePacket(rest);

    subpackets.push(packet);
  }

  if (lengthValue === 15) {
    rest = body.substring(packetEnd);
  }

  const base = { version, typeId, type: "operator" } as const;
  return [{ ...base, subpackets }, rest];
}

function packetToString(bitString: string) {
  const [{ typeId }] = parseStart(bitString);

  if (typeId === 4) {
    return [
      bitString.substring(0, 3),
      bitString.substring(3, 6),
      bitString.substring(6),
    ].join(" ");
  }

  return [
    bitString.substring(0, 3),
    bitString.substring(3, 6),
    bitString.substring(6, 7),
    bitString.substring(7, 18),
  ].join(" ");
}

export function evalPacket(packet: Packet): number {
  if (packet.type === "literal") {
    return packet.value;
  }

  switch (packet.typeId) {
    case 0:
      return applyOperator(packet, sum);
    case 1:
      return applyOperator(packet, product);
    case 2:
      return applyOperator(packet, (ns) => Math.min(...ns));
    case 3:
      return applyOperator(packet, (ns) => Math.max(...ns));
    case 5:
      return applyOperator(packet, ([a, b]) => (a > b ? 1 : 0));
    case 6:
      return applyOperator(packet, ([a, b]) => (a < b ? 1 : 0));
    case 7:
      return applyOperator(packet, ([a, b]) => (a === b ? 1 : 0));
  }

  throw new Error("packet typeId was " + packet.typeId);
}

export function applyOperator(
  operator: Operator,
  fn: Fn<number[], number>
): number {
  return fn(operator.subpackets.map(evalPacket));
}

export function part2(fileContents: string) {
  const parsed = parseInput(fileContents);
  const bitString = parsed
    .map((c) => Number.parseInt(c, 16).toString(2).padStart(4, "0"))
    .join("");

  const packet = parse(bitString);

  return evalPacket(packet);
}

function parseInput(input: string) {
  return input.split("");
}
