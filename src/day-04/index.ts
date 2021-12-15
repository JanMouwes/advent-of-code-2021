import { transpose } from '../util/grid';
import { id } from '../util/fn';
import { sum } from '../util/maths';


export const examples = {
  input: `7,4,9,5,11,17,23,2,0,14,21,24,10,16,13,6,15,25,12,22,18,20,8,19,3,26,1

22 13 17 11  0
 8  2 23  4 24
21  9 14 16  7
 6 10  3 18  5
 1 12 20 15 19

 3 15  0  2 22
 9 18 13 17  5
19  8  7 25 23
20 11 10 24  4
14 21 16 12  6

14 21 17 24  4
10 16 15  9 19
18  8 23 26 20
22 11 13  6  5
2  0 12  3  7`,
  outputs: {
    part1: "4512",
    part2: "1924",
  },
} as const;

export function part1(fileContents: string) {
  const [numbers, boards]: [number[], Board[]] = parseInput(fileContents);

  const markedBoards = boards.map((board) => ({
    board,
    markings: createMarkings(board),
  }));

  for (let number of numbers) {
    for (let markedBoard of markedBoards) {
      const { board, markings } = markedBoard;
      const found = findNumberOnBoard(number, board);

      if (found != null) {
        const [x, y] = found;

        markings[x][y] = true;
      }

      if (hasBoardWon(markedBoard)) {
        const sumUnmarked = unmarkedSum(markedBoard);

        return sumUnmarked * number;
      }
    }
  }
}

type Grid<T> = T[][];
type Board = Grid<number>;
type MarkedBoard = { board: Board; markings: Grid<boolean> };

function unmarkedSum({ board, markings }: MarkedBoard) {
  const coords = markings
    .map((row, x) =>
      row
        .map((b, y) => [b, [x, y]] as [boolean, [number, number]])
        .filter(([b]) => !b)
        .map(([, coords]) => coords)
    )
    .flat();

  return sum(coords.map(([x, y]) => board[x][y]));
}

function hasBoardWon({ markings }: MarkedBoard) {
  const rows = markings;
  const columns = transpose(rows);

  const options = rows.concat(columns);

  return options.some((row) => row.every(id));
}

function findNumberOnBoard(
  number: number,
  board: Board
): [number, number] | null {
  let x = 0,
    y = 0;

  const found =
    board.find((row, rowX) => {
      const rowY = row.findIndex((n) => n === number);

      const yFound = rowY !== -1;
      if (yFound) {
        x = rowX;
        y = rowY;
      }
      return yFound;
    }) != null;

  return found ? [x, y] : null;
}

function createMarkings(board: Board): Grid<boolean> {
  return board.map((row) => row.map(() => false));
}

export function part2(fileContents: string) {
  const [numbers, boards]: [number[], Board[]] = parseInput(fileContents);

  let markedBoards = boards.map((board) => ({
    board,
    markings: createMarkings(board),
  }));

  for (let number of numbers) {
    for (let markedBoard of markedBoards) {
      const { board, markings } = markedBoard;
      const found = findNumberOnBoard(number, board);

      if (found != null) {
        const [x, y] = found;

        markings[x][y] = true;
      }
    }

    const filtered = markedBoards.filter((b) => !hasBoardWon(b));

    let markedBoard;

    if (filtered.length === 0) {
      markedBoard = [...markedBoards].reverse()[0];
    }

    if (filtered.length === 1 && hasBoardWon(filtered[0])) {
      markedBoard = filtered[0];
    }
    if (markedBoard != null) {
      const sumUnmarked = unmarkedSum(markedBoard);

      return sumUnmarked * number;
    }

    markedBoards = filtered;
  }
}

function parseInput(input: string): [number[], Board[]] {
  const [callingOrder, ...rest] = input
    .split("\n\n")
    .filter((i) => i.trim() != "");
  const boards = rest.map(parseBoard);

  return [callingOrder.split(",").map(Number), boards];
}

function parseBoard(raw: string): Board {
  const rows = raw.split("\n").filter((r) => r.trim() != "");

  return rows.map((row) =>
    row
      .split(" ")
      .filter((c) => c !== "")
      .map(Number)
  );
}
