import { readFile } from "fs/promises";

async function main(day: string): Promise<void> {
  const folder = "day-" + day.padStart(2, "0");

  const { part1, part2 } = await import("./" + folder);
  const input = (await readFile("./src/" + folder + "/input.txt")).toString();

  console.log("PART 1:\n");
  await runTimed(() => printResult(part1(input)));

  console.log("\n\n------------\n\n");

  console.log("PART 2:\n");
  await runTimed(() => printResult(part2(input)));
}

async function runSolution(fn: Function, input: string): Promise<any> {
  return fn(input);
}

async function runTimed(fn: Function): Promise<number> {
  const start = Date.now();

  await fn();

  const end = Date.now();
  const runningTime = (end - start) / 1000;

  console.log(`Ran in ${runningTime} seconds`);

  return runningTime;
}

function printResult(result: any): void {
  console.log(`Result:\n\n ${result}\n`);
}

main(process.argv[2]);
