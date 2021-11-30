import {run} from "./day-1";
import {readFile} from "fs/promises"

function main() {
  const start = Date.now()

  runSolution().then((result) => {
    console.log(`result:\n\n${result}\n`);

    const end = Date.now();
    const runningTime = (end - start) / 1000;

    console.log(`Ran in ${runningTime} seconds`)
  })
}

async function runSolution() {
  const contents = await readFile("./input.txt");

  return run(contents.toString());
}

main();