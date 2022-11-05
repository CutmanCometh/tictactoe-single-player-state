import { createMachine, assign, interpret } from 'xstate';
import { useMachine } from '@xstate/react';
import './App.css';

const X = 'x';
const O = 'o';

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

  // check horizontals

  // check verticals

  return {
    isOver,
    winner,
    isCat,
  }
});

function isOver(context, event) {
  console.log(`isOver: ${context.count}`);
  return context.count > 9;
}

function isLegalMove(context, event) {
  console.log('isLegalMove')
  const { squareClicked } = event.data;
  console.log(`isLegalMove: ${squareClicked}`)
  return context.board[squareClicked] === null;
}

const stateMachine = createMachine(
  {
    predictableActionArguments: true,
    id: 'ttt',
    initial: 'playing',
    context: {
      count: 0,
      player: X,
      board: [null, null, null, null, null, null, null, null, null],
      isOver: false,
      winner: null,
      cat: false,
    },
    states: {
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
    actions: { swapPlayer, markSquare, checkWin },
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
            className={`board-piece board-piece-${index}`}
            onClick={() => { send({type: 'PLAY', data: {squareClicked: index} })}}
          >
            {elem || null}
          </span>
        ))}
      </div>
    </main>
  );
}

export default App;
