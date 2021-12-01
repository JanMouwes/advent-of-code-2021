
export function part1(fileContents: string) {
  const numbers: number[] = fileContents.split("\n").map(n => Number(n));

  const increases = numbers.filter((num, index, arr) => {
    if (index ===0) return false;

    const prev = arr[index-1]
console.log(prev, num, prev < num);


    return arr[index-1] < num;
  })

  return increases.length;
}

export function part2(fileContents: string) {
  const numbers: number[] = fileContents.split("\n").map(n => Number(n));

  const windows = numbers.map((num, index, arr) => {
    if (index < 2) return 0;

    return arr[index-2] + arr[index-1] + num;
  }).splice(2)

  return part1(windows.join("\n"));
}