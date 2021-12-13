import { lines, concatLists, count, id, sum, second, middle } from '../util/index';
export const examples = {
  input: `[({(<(())[]>[[{[]{<()<>>
[(()[<>])]({[<{<<[]>>(
{([(<{}[<>[]}>{[]{[(<()>
(((({<>}<{<{<>}{[]{[]{}
[[<[([]))<([[{}[[()]]]
[{[{({}]{}}([{[{{{}}([]
{<[[]]>}<{[{[{[]{()[[[]
[<(<(<(<{}))><([]([]()
<{([([[(<>()){}]>(<<{{
<{([{{}}[<[[[<>{}]]]>[]]
  `,
  outputs: {
    part1: "26397",
    part2: "288957",
  },
} as const;

const openers = ["{", "[", "<", "("] as const;
const closers = ["}", "]", ">", ")"] as const;

type Opener = typeof openers[number];
type Closer = typeof closers[number];

type Token = Opener | Closer;


const pairs = [
  ["[", "]"],
  ["{", "}"],
  ["(", ")"],
  ["<", ">"]
] as const;

function matchOpener(opener: Opener) {
  return second(pairs.find(([o,]) => o === opener)!);
}

export function part1(fileContents: string) {
  const closerPoints = {
    ")": 3,
    "]": 57,
    "}": 1197,
    ">": 25137,
  } as const;

  const parsed = parseInput(fileContents);

  const errors = concatLists(parsed.map(line => {
    const stack: Opener[] = [];

    for (const c of line) {
      if (openers.includes(c as Opener)) {
        stack.push(c as Opener);
        continue;
      }

      const [expected,] = pairs.find(([, end]) => c === end)!;

      const last = stack.pop();

      if (last === expected) {
        continue;
      }

      return [c];
    }

    return [];
  }));

  const entries = [...count(errors, id).entries()];

  return sum(entries.map(([token, amount]) => amount * closerPoints[token as Closer]));
}



export function part2(fileContents: string) {
  const closerPoints = {
    ")": 1,
    "]": 2,
    "}": 3,
    ">": 4,
  } as const;

  const parsed = parseInput(fileContents);

  const incompleteLines = parsed.map(line => {
    const stack: Opener[] = [];

    for (const c of line) {
      if (openers.includes(c as Opener)) {
        stack.push(c as Opener);
        continue;
      }

      const [expected,] = pairs.find(([, end]) => c === end)!;

      const last = stack.pop();

      if (last === expected) {
        continue;
      }

      return [];
    }

    return stack;
  }).filter(l => l.length > 0)
    .map(stack => [...stack].reverse().map(matchOpener));

  const scores = incompleteLines.map(line => line.reduce((score, char) => score * 5 + closerPoints[char], 0));

  scores.sort((a, b) => a - b);

  return middle(scores);
}

function parseInput(input: string): Token[][] {
  return lines(input).map(l => l.split("")) as Token[][];
}
