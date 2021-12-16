export const examples = {
  input: ``,
  outputs: {
    part1: "",
    part2: "",
  },
} as const;

export function part1(fileContents: string) {
  const parsed: any = parseInput(fileContents);

  console.log(parsed);  

  return undefined;
}

export function part2(fileContents: string) {
  const parsed: any = parseInput(fileContents);

  console.log(parsed);  

  return undefined;
}

function parseInput(input: string): any {
  return input;
}
