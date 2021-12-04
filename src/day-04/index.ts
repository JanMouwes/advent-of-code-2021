import {range, transpose, id, sum} from "../util"

const INPUT_WIDTH = 12;

export function part1(fileContents: string) {
  const [numbers, boards]: [number[], Board[]] = parseInput(fileContents);

  const markedBoards = boards.map(board => ({board, markings: createMarkings(board)}))
  
  for (let number of numbers) {
    for (let markedBoard of markedBoards) {
      const {board, markings} = markedBoard;
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
type MarkedBoard = {board: Board, markings: Grid<boolean>};

function unmarkedSum({board, markings}: MarkedBoard) {
  const coords = markings.map(
    (row, x) => row.map((b, y) => [b, [x, y]] as [boolean, [number, number]])
                   .filter(([b]) => !b)
                   .map(([, coords]) => coords)
  ).flat();

  return sum(coords.map(([x, y]) => board[x][y]))
}

function hasBoardWon({markings}: MarkedBoard) {
  const rows = markings;
  const columns = transpose(rows);

  const options = rows.concat(columns);

  return options.some(row => row.every(id));
}

function findNumberOnBoard(number: number, board: Board): [number, number] | null {
  let x = 0, y = 0;
  
  const found = board.find((row, rowX) => {
    const rowY = row.findIndex(n => n === number);

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
  return board.map(row =>  row.map(() => false));
}

function parseInput(input: string): [number[], Board[]] {
  const [callingOrder, ...rest] = input.split("\n\n").filter((i) => i.trim() != "");
  const boards = rest.map(parseBoard)

  return [callingOrder.split(",").map(Number), boards];
}

function parseBoard(raw: string): Board {
  const rows = raw.split("\n").filter(r => r.trim() != "");

  return rows.map(row => row.split(" ").filter(c => c !== "").map(Number));
}


export function part2(fileContents: string) {
  const [numbers, boards]: [number[], Board[]] = parseInput(fileContents);

  let markedBoards = boards.map(board => ({board, markings: createMarkings(board)}))
  
  for (let number of numbers) {
    for (let markedBoard of markedBoards) {
      const {board, markings} = markedBoard;
      const found = findNumberOnBoard(number, board);

      if (found != null) {
        const [x, y] = found;

        markings[x][y] = true;
      }
    }
    
    const filtered = markedBoards.filter(b => !hasBoardWon(b));

    let markedBoard;

    if (filtered.length === 0) {
      markedBoard = [...markedBoards].reverse()[0];
    }

    if (filtered.length === 1 && hasBoardWon(filtered[0])) {
      markedBoard = filtered[0]
    }
    if (markedBoard != null) {
      const sumUnmarked = unmarkedSum(markedBoard);
      
      console.log(number,sumUnmarked);
      

      return sumUnmarked * number;
    }

    markedBoards = filtered;

  }
}

