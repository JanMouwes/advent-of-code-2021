import { lines, words, second, concatLists, uncurry, intersect, filterInOut, partition, strIntersect, strDifference, difference, sum } from '../util';

export const examples = {
  input: `
be cfbegad cbdgef fgaecd cgeb fdcge agebfd fecdb fabcd edb | fdgacbe cefdb cefbgd gcbe
edbfga begcd cbg gc gcadebf fbgde acbgfd abcde gfcbed gfec | fcgedb cgb dgebacf gc
fgaebd cg bdaec gdafb agbcfd gdcbef bgcad gfac gcb cdgabef | cg cg fdcagb cbg
fbegcd cbd adcefb dageb afcb bc aefdc ecdab fgdeca fcdbega | efabcd cedba gadfec cb
aecbfdg fbg gf bafeg dbefa fcge gcbea fcaegb dgceab fcbdga | gecf egdcabf bgf bfgea
fgeab ca afcebg bdacfeg cfaedg gcfdb baec bfadeg bafgc acf | gebdcfa ecba ca fadegcb
dbcfg fgd bdegcaf fgec aegbdf ecdfab fbedc dacgb gdcebf gf | cefg dcbef fcge gbcadfe
bdfegc cbegaf gecbf dfcage bdacg ed bedf ced adcbefg gebcd | ed bcgafe cdgba cbgef
egadfb cdbfeg cegd fecab cgb gbdefca cg fgcdab egfdb bfceg | gbdfcae bgc cg cgb
gcafb gcf dcaebfg ecagb gf abcdeg gaef cafbge fdbac fegbdc | fgae cfgab fg bagce`,
  outputs: {
    part1: "26",
    part2: "61229"
  }
} as const;

type DisplayData = [string[], string[]];

export function part1(fileContents: string) {
  const parsed: DisplayData[] = parseInput(fileContents);

  const seconds = concatLists(parsed.map(second));

  return seconds
    .map(str => str.length)
    .filter(n => [2, 4, 3, 7].includes(n))
    .length;
}

export function part2(fileContents: string) {
  const parsed: DisplayData[] = parseInput(fileContents);

  const result = parsed.map(uncurry(determineNumbers));

  return sum(result.map(ns => Number(ns.join(""))));
}

const allSegments = ["top", "middle", "bottom", "topleft", "topright", "bottomleft", "bottomright"];
type Segment = typeof allSegments[number];
const allLetters = ["a", "b", "c", "d", "e", "f", "g"] as const;
type Letter = typeof allLetters[number];

export function determineNumbers(input: string[], output: string[]): string[] {
  const numbers = input.concat(output);
  const numberSet = new Set(numbers);
  const byLength = partition([...numberSet.values()], n => n.length);
  const knownSegments = new Map<Segment, Letter>();


  const knownSequences: Record<string, string | null> = {
    zero: null, one: null, two: null, three: null, four: null, five: null, six: null, seven: null, eight: null, nine: null
  };

  if (byLength.has(4)) {
    const [four] = byLength.get(4)!;
    knownSequences.four = four;
  }
  if (byLength.has(7)) {
    const [eight] = byLength.get(7)!;
    knownSequences.eight = eight;
  }

  if (byLength.has(2) && byLength.has(3)) {
    const [one] = byLength.get(2)!;
    const [seven] = byLength.get(3)!;
    const [top] = seven.split("").filter(c => !one.includes(c))

    knownSequences.one = one;
    knownSequences.seven = seven;

    knownSegments.set("top", top as Letter);
  }

  if (byLength.has(3) && byLength.has(5)) {
    const [seven] = byLength.get(3)!;

    const fives = byLength.get(5) || [];
    const [[three]] = filterInOut(fives, cs => intersect(cs.split(""), seven.split("")).length === 3)

    if (three != null) {
      knownSequences.three = three;
    }
  }

  if (knownSequences.three != null && byLength.has(6)) {
    const { three } = knownSequences;
    const sixes = byLength.get(6) || [];
    const [[nine], rest] = filterInOut(sixes, str => strIntersect(str, three).length === three.length);

    if (nine != null) {
      knownSequences.nine = nine;

      const [topleft] = strDifference(nine, three)
      knownSegments.set("topleft", topleft as Letter);

      const [bottomleft] = strDifference(nine, allLetters.join(""));
      knownSegments.set("bottomleft", bottomleft as Letter);
    }

    if (knownSequences.one != null) {
      const { one } = knownSequences;
      const [[six], [zero]] = filterInOut(rest, str => strIntersect(str, one).length === 1)

      if (six != null) {
        knownSequences.six = six;

        const [topright] = strDifference(six, allLetters.join(""));
        knownSegments.set("topright", topright as Letter);

        if (knownSequences.one != null) {
          const { one } = knownSequences;
          const [bottomright] = strDifference(one, topright);

          knownSegments.set("bottomright", bottomright as Letter);
        }
      }
      if (zero != null) {
        knownSequences.zero = zero;

        const [middle] = strDifference(zero, allLetters.join(""));
        knownSegments.set("middle", middle as Letter);
      }
    }
  }

  if ([...knownSegments.values()].length === 6) {
    const [lastLetter] = difference<string>(allLetters, [...knownSegments.values()]);
    const [lastSegment] = difference(allSegments, [...knownSegments.keys()])

    knownSegments.set(lastSegment, lastLetter as Letter);
  }

  const knownLetters = new Map([...knownSegments.entries()].map(([k, v]) => [v, k]));

  return output.map(n => toNumber(mapToPattern(n.split("") as Letter[], knownLetters)).toString());
}

/**
 *  aaaa
 * b    c
 * b    c
 *  dddd
 * e    f
 * e    f
 *  gggg
 * 
 * [a, b, c, d, e, f, g]
 */
type DisplayPattern = [boolean, boolean, boolean, boolean, boolean, boolean, boolean];
function toNumber(pattern: DisplayPattern) {
  const patterns: Record<number, DisplayPattern> = {
    0: [true, true, true, false, true, true, true],
    1: [false, false, true, false, false, true, false],
    2: [true, false, true, true, true, false, true],
    3: [true, false, true, true, false, true, true],
    4: [false, true, true, true, false, true, false],
    5: [true, true, false, true, false, true, true],
    6: [true, true, false, true, true, true, true],
    7: [true, false, true, false, false, true, false],
    8: [true, true, true, true, true, true, true],
    9: [true, true, true, true, false, true, true],
  };

  const tuple = Object.entries(patterns).find(([, val]) => pattern.join() === val.join());

  if (tuple != null) {
    // number
    return Number(tuple[0]);
  }

  throw new Error("Invalid pattern " + pattern.join());
}

function mapToPattern(string: Letter[], letterMap: Map<Letter, Segment>): DisplayPattern {
  const translated = new Set<Segment>(string.map(c => letterMap.get(c)!));

  const segments: readonly [Segment, Segment, Segment, Segment, Segment, Segment, Segment] = [
    "top", "topleft", "topright", "middle", "bottomleft", "bottomright", "bottom"
  ] as const;

  return segments.map(s => translated.has(s)) as DisplayPattern;
}

function parseInput(input: string): DisplayData[] {
  return lines(input).map(parseLine);
}

function parseLine(line: string): DisplayData {
  const [input, output] = line.split(" | ");

  return [
    words(input),
    words(output)
  ]
}