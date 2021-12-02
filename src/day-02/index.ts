export function part1(fileContents: string) {
  const commands: [string, number][] = parseCommands(fileContents);

  const buckets = Object.fromEntries(
    ["forward", "down", "up"].map((dir) => [
      dir,
      commands.filter(([fst,]) => fst === dir).map(second),
    ])
  );

  const currentPosition = [
    sum(buckets["forward"]),
    sum(buckets["down"]) - sum(buckets["up"]),
  ];

  return currentPosition[0] * currentPosition[1];
}

export function part2(fileContents: string) {
  const commands: [string, number][] = parseCommands(fileContents);

  const currentPosition: CurrentPosition = commands.reduce(calculateNewDepth, [
    0, 0, 0,
  ] as CurrentPosition);

  const [position, depth] = currentPosition;

  return position * depth;
}

type CurrentPosition = [number, number, number];
type CommandPair = [string, number];

function calculateNewDepth(
  [position, depth, aim]: CurrentPosition,
  [command, argument]: CommandPair
): CurrentPosition {
  if (command === "forward") {
    return [position + argument, depth + argument * aim, aim];
  }

  if (command === "up") {
    argument = -argument;
  }

  return [position, depth, aim + argument];
}

function parseCommands(commands: string): [string, number][] {
  return commands
    .split("\n")
    .filter((i) => i.trim() != "")
    .map((c) => {
      const [command, arg] = c.split(" ");

      return [command, Number(arg)];
    });
}

function second([, snd]: [any, any]) {
  return snd;
}

function sum(list: number[]) {
  return list.reduce((x, y) => x + y);
}
