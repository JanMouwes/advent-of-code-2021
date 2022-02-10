import { range } from './range';
import { testFnIO } from './testing';

describe(range.name, () => {
  testFnIO([
    {
      args: [1],
      expected: [0]
    },
    {
      args: [0, 10],
      expected: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
    },
    {
      args: [-3, 0],
      expected: [-3, -2, -1]
    }
  ], range)
})
