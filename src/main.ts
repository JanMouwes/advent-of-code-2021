import { readFile } from "fs/promises";
import 'colorts/lib/string';

const emptyExamples = { input: undefined, outputs: { part1: undefined, part2: undefined } };

async function main(day: string): Promise<void> {
  const folder = "day-" + day.padStart(2, "0");

  const { part1, part2, examples = emptyExamples } = await import("./" + folder);
  const input = (await readFile("./src/" + folder + "/input.txt")).toString();

  try {
    console.log("PART 1:\n".gray);

    await testPart(part1, examples.input, examples.outputs.part1);

    await runTimed(() => printResult(part1(input)));
  } catch (e: any) {
    console.error(e.message);
  }

  console.log("\n\n------------------------\n\n".gray);

  try {
    console.log("PART 2:\n".gray);

    await testPart(part2, examples.input, examples.outputs.part2);

    await runTimed(() => printResult(part2(input)));
  } catch (e: any) {
    console.error(e.message);
  }
}

async function testPart(fn: Function, input?: string, output?: string) {
  if (input == null || output == null) {
    return;
  }

  await testFunction(fn, input, output);
  console.log();
}

async function testFunction(fn: Function, input: string, output: string) {
  const actual = (await fn(input)).toString();

  if (actual !== output.toString()) {
    throw new Error(`Expected ${fn.name}("${input}") to be equal to ${output}, was ${actual}`.red);
  }

  console.log("test successful".green);

}

async function runTimed(fn: Function): Promise<number> {
  const start = Date.now();

  await fn();

  const end = Date.now();
  const runningTime = (end - start) / 1000;

  console.log(`Ran in ${runningTime} seconds`.gray);

  return runningTime;
}

function printResult(result: any): void {
  console.log(`Result:\n\n`.gray, `${result}\n`.magenta);
}

main(process.argv[2]);
