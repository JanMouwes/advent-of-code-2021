import { part1, part2 } from "./day-05";
import { readFile } from "fs/promises";

async function main(): Promise<void> {
  console.log("PART 1:\n");
  await runTimed(() => runSolution(part1).then(printResult));

  console.log("\n\n------------\n\n");

  console.log("PART 2:\n");
  await runTimed(() => runSolution(part2).then(printResult));
}

async function runSolution(fn: Function): Promise<any> {
  const contents = await readFile("./input.txt");

  return fn(contents.toString());
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

main();
