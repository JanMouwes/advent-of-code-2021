import { Tuple, equals, second } from "../util/tuple";
import { lines } from "../util/string";
import { range } from "../util/range";
import { count, uniques } from "../util/list";
import { id } from "../util/fn";
import { max, min, sum } from "../util/maths";

type Template = string;
type Rule = [Tuple<string, string>, string];

export const examples = {
  input: `NNCB

CH -> B
HH -> N
CB -> H
NH -> C
HB -> C
HC -> B
HN -> C
NN -> C
BH -> H
NC -> B
NB -> B
BN -> B
BB -> N
BC -> B
CC -> N
CN -> C`,
  outputs: {
    part1: "1588",
    part2: undefined, //"2188189693529",
  },
} as const;

export function part1(fileContents: string) {
  const [template, rules]: any = parseInput(fileContents);

  const result = range(10).reduce((t) => applyRules(t, rules), template);

  const counts = count(result.split(""), id);

  const [, maxCount] = max([...counts.entries()], second);
  const [, minCount] = min([...counts.entries()], second);

  return maxCount - minCount;
}

function applyRules(template: string, rules: Rule[]): string {
  const ps = pairs(template);
  const [head] = ps[0];

  return (
    head +
    ps
      .map((pair) => {
        const rule = rules.find(([input]) => equals(input, pair));

        if (rule == undefined) {
          return pair;
        }

        const [, c] = pair;
        const [, b] = rule;

        return [b, c];
      })
      .flat()
      .join("")
  );
}

function pairs(string: string): [string, string][] {
  const letters = string.split("");
  const [, ...tail] = letters;

  return tail.reduce((agg, letter, index) => {
    const prev = letters[index];
    agg.push([prev, letter]);
    return agg;
  }, [] as [string, string][]);
}

export function part2(fileContents: string) {
  const [template, rules] = parseInput(fileContents);

  let length = template.length;
  let b = 1;
  let h = 1;
  const result = range(20).reduce((t, i) => {
    console.log(uniques(pairs(t)).map((s) => s.join("")));

    length = length * 2 - 1;

    return applyRules(t, rules);
  }, template);

  const counts = count(result.split(""), id);

  const [, maxCount] = max([...counts.entries()], second);
  const [, minCount] = min([...counts.entries()], second);

  return maxCount - minCount;
}

function parseInput(input: string): [Template, Rule[]] {
  const [template, rules] = input.split("\n\n");

  return [
    template,
    lines(rules)
      .map((line) => line.split(" -> "))
      .map(([start, end]) => [start.split("") as [string, string], end]),
  ];
}
