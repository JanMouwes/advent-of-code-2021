import { readFile } from "fs/promises";
import "colorts/lib/string";
import { range } from "./util/index";

const emptyExamples = {
  input: undefined,
  outputs: { part1: undefined, part2: undefined },
};

async function main(day: string): Promise<void> {
  let [start, end = null] = day.split(":");

  if (end != null) {
    start = start || "1";

    for (const n of range(Number(start), Number(end) + 1)) {
      console.log("\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n");
      await runDay(n.toString());
    }
  } else {
    runDay(start);
  }
}

async function runDay(day: string): Promise<void> {
  const folder = "day-" + day.padStart(2, "0");

  const {
    part1,
    part2,
    examples = emptyExamples,
  } = await import("./" + folder);
  const input = (await readFile("./src/" + folder + "/input.txt")).toString();

  console.log("Day " + day + "\n");

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
  const actual = (await fn(input))?.toString() || "undefined";

  if (actual !== output.toString()) {
    function cutOffString(string: string, maxSize: number) {
      const [head, rest] = [
        string.slice(0, maxSize - 3),
        string.slice(maxSize - 3),
      ];
      const ellipsis = rest.length > 3 ? "..." : rest;
      return `${head}${ellipsis}`.trim();
    }

    throw new Error(
      `Expected result of ${fn.name}("${cutOffString(
        input,
        12
      )}") to be equal to ${cutOffString(output, 12)}, was ${cutOffString(
        actual,
        12
      )}`.red
    );
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
