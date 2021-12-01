export function part1(fileContents: string) {
  const numbers: number[] = fileContents.split("\n").map((n) => Number(n));

  const increases = numbers.filter((num, index, arr) => {
    return index !== 0 && arr[index - 1] < num;
  });

  return increases.length;
}

export function part2(fileContents: string) {
  const numbers: number[] = fileContents.split("\n").map((n) => Number(n));

  function calculateWindow(num: number, index: number, arr: number[]): number {
    if (index < 2) {
      return 0;
    }

    return arr[index - 2] + arr[index - 1] + num;
  }

  const windows = numbers.map(calculateWindow).splice(2);

  return part1(windows.join("\n"));
}
