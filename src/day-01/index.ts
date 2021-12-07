export const examples = {
  input: `
199
200
208
210
200
207
240
269
260
263
`,
  outputs: {
    part1: "7",
    part2: "5"
  }
} as const;

export function part1(fileContents: string) {
  const numbers: number[] = parseInput(fileContents);

  const increases = numbers.filter((num, index, arr) => {
    return index !== 0 && arr[index - 1] < num;
  });

  return increases.length;
}

export function part2(fileContents: string) {
  const numbers: number[] = parseInput(fileContents);

  function calculateWindow(num: number, index: number, arr: number[]): number {
    if (index < 2) {
      return 0;
    }

    return arr[index - 2] + arr[index - 1] + num;
  }

  const windows = numbers.map(calculateWindow).splice(2);

  return part1(windows.join("\n"));
}

function parseInput(input: string) {
  return input.split("\n").filter(l => l.trim() !== "").map((n) => Number(n));
}
