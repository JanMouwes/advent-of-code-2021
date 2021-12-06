import { range, id, count, sum } from '../util/index';
export function part1(fileContents: string) {
  const parsed: any = parseInput(fileContents);

  console.log(count(parsed, id));
  

  return calculateFishCountByDay(parsed, 80);
}

export function part2(fileContents: string) {
  const parsed: any = parseInput(fileContents);

  return calculateFishCountByDay(parsed, 256);
}

function calculateFishCountByDay(fish: number[], day: number): number {
  function nextFishMap(map: Map<number, number>): Map<number, number> {
    const newMap = new Map<number, number>()

    for (let [days, fish] of [...map.entries()]) {
      if (days == 0) {
        days = 7;
        newMap.set(8, fish + (newMap.get(8) || 0));
      }

      const newDays = days - 1;
      const newValue = fish + (newMap.get(newDays) || 0); 
      
      newMap.set(newDays, newValue)
    }

    return newMap;
  }

  const fishMap = count(fish, id);
  console.log(fishMap);
  

  return sum([...range(day).reduce(nextFishMap, fishMap).values()])
}

function parseInput(input: string): number[] {
  return input.split(",").map(Number);
}
