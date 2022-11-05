import { assign } from "xstate";
import { X, O } from "./players";

const initialContext = {
  count: 0,
  player: X,
  board: [null, null, null, null, null, null, null, null, null],
  isOver: false,
  winner: null,
  isCat: false,
};

export const reset = assign(() => {
  console.log("reset");
  return initialContext;
});

export const markSquare = assign({
  board: (context, event) => {
    console.log(`markSquare`);
    const { board: oldBoard, player } = context;
    const { squareClicked } = event.data;
    const newBoard = oldBoard.map((elem, index) =>
      index === squareClicked ? player : elem,
    );
    console.log(`markSquare: ${oldBoard} -> ${newBoard}`);
    return newBoard;
  },
});

export const swapPlayer = assign({
  player: (context) => {
    const oldPlayer = context.player;
    const newPlayer = oldPlayer === X ? O : X;
    console.log(`swapPlayer: ${oldPlayer} -> ${newPlayer}`);
    return newPlayer;
  },
});

export const checkWin = assign(({ board }) => {
  console.log("checkWin");
  let isOver = false;
  let winner = null;
  let isCat = false;

  const [zero, one, two, three, four, five, six, seven, eight] = board;
  // check horizontals
  if ((zero === one) & (one === two) && two !== null) {
    // top row
    isOver = true;
    winner = zero;
  } else if (three === four && four === five && five !== null) {
    // middle row
    isOver = true;
    winner = three;
  } else if (six === seven && seven === eight && eight !== null) {
    // bottom row
    isOver = true;
    winner = six;
  } else if (zero === three && three === six && six !== null) {
    // left column
    isOver = true;
    winner = zero;
  } else if (one === four && four === seven && seven !== null) {
    // middle column
    isOver = true;
    winner = one;
  } else if (two === five && five === eight && eight !== null) {
    // right column
    isOver = true;
    winner = two;
  } else if (zero === four && four === eight && eight !== null) {
    // diagonal down to the right
    isOver = true;
    winner = zero;
  } else if (two === four && four === six && six !== null) {
    // diagonal down to the left
    isOver = true;
    winner = two;
  } else if (board.filter((square) => square === null).length === 0) {
    // cat game
    isOver = true;
    isCat = true;
  }

  return {
    isOver,
    winner,
    isCat,
  };
});

export function isOver(context) {
  console.log(`isOver: ${context.isOver}`);
  return context.isOver;
}

export function isLegalMove(context, event) {
  const { squareClicked } = event.data;
  console.log(`isLegalMove: ${squareClicked}`);
  return context.board[squareClicked] === null;
}
