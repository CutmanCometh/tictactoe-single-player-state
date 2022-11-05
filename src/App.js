import { createMachine, assign } from 'xstate';
import { useMachine } from '@xstate/react';
import './App.css';

const X = 'x';
const O = 'o';

const initialContext = {
  count: 0,
  player: X,
  board: [null, null, null, null, null, null, null, null, null],
  isOver: false,
  winner: null,
  isCat: false,
};

const reset = assign(() => {
  console.log('reset');
  return initialContext;
});

const markSquare = assign({
  board: (context, event) => {
    console.log(`markSquare`)
    const { board: oldBoard, player } = context;
    const { squareClicked } = event.data;
    const newBoard = oldBoard.map((elem, index) => index === squareClicked ? player : elem);
    console.log(`markSquare: ${oldBoard} -> ${newBoard}`);
    return newBoard;
  },
});

const swapPlayer = assign({
  player: (context) => {
    const oldPlayer = context.player;
    const newPlayer = oldPlayer === X ? O : X;
    console.log(`swapPlayer: ${oldPlayer} -> ${newPlayer}`);
    return newPlayer;
  },
});

const checkWin = assign(({board}) => {
  console.log('checkWin')
  let isOver = false;
  let winner = null;
  let isCat = false;

  const [zero, one, two, three, four, five, six, seven, eight ] = board;
  // check horizontals
  if (zero === one & one === two && two !== null) { // top row
    isOver = true;
    winner = zero;
  } else if (three === four && four === five && five !== null) { // middle row
    isOver = true;
    winner = three;
  } else if (six === seven && seven === eight && eight !== null) { // bottom row
    isOver = true;
    winner = six;
  } else if (zero === three && three === six && six !== null) { // left column
    isOver = true;
    winner = zero;
  } else if (one === four && four === seven && seven !== null) { // middle column
    isOver = true;
    winner = one;
  } else if (two === five && five === eight && eight !== null) { // right column
    isOver = true;
    winner = two;
  } else if (zero === four && four === eight && eight !== null) { // diagonal down to the right
    isOver = true;
    winner = zero;
  } else if (two === four && four === six && six !== null) { // diagonal down to the left
    isOver = true;
    winner = two;
  } else if (board.filter((square) => square === null).length === 0) { // cat game
    isOver = true;
    isCat = true;
  }

  return {
    isOver,
    winner,
    isCat,
  }
});

function isOver(context) {
  console.log(`isOver: ${context.isOver}`);
  return context.isOver;
}

function isLegalMove(context, event) {
  const { squareClicked } = event.data;
  console.log(`isLegalMove: ${squareClicked}`)
  return context.board[squareClicked] === null;
}

const stateMachine = createMachine(
  {
    predictableActionArguments: true,
    id: 'ttt',
    initial: 'init',
    context: initialContext,
    states: {
      init: {
        always: {
          target: 'playing',
          actions: 'reset',
        },
      },
      playing: {
        always: {
          target: 'over',
          cond: 'isOver',
        },
        on: {
          PLAY: {
            target: 'playing',
            actions: ['markSquare', 'swapPlayer', 'checkWin'],
            cond: 'isLegalMove',
          }
        }
      },
      over: {

      }
    }, 
  },
  {
    actions: { swapPlayer, markSquare, checkWin, reset },
    guards: { isOver, isLegalMove },
  }
);

function App() {
  const [state, send] = useMachine(stateMachine);
  console.log(state.value)
  console.log(state.context)
  return (
    <main>
      <div
        className='game-container'
      >
        {state.context.board.map((elem, index) => (
          <span
            key={index}
            className={`board-piece board-piece-${index} ${elem === null && 'open'}`}
            onClick={() => {
              if (elem === null && !state.context.isOver) {
                send({type: 'PLAY', data: {squareClicked: index} })
              }
            }}
          >
            {elem || null}
          </span>
        ))}
      </div>
      {state.value === 'over' && (
        <>
          <h2>Game Over</h2>
          {state.context.winner && (<h3>Winner: {state.context.winner}</h3>)}
          {state.context.isCat && (<h3>Cat game! (tie)</h3>)}
        </>
      )}
    </main>
  );
}

export default App;
