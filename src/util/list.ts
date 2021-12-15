export function uniques<T>(list: readonly T[]): T[] {
  return [...new Set<string>(list.map(v => JSON.stringify(v)))].map(v => JSON.parse(v))
}

