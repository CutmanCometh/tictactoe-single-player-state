import React from 'react';
import './App.css';
import { useMachine } from '@xstate/react';
import { stateMachine } from './stateMachine';

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
            className={`board-piece board-piece-${index} ${(elem === null && !state.context.isOver) && 'open'}`}
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
      {state.value === 'playing' && (
        <span>Next player: {state.context.player}</span>
      )}
      {state.value === 'over' && (
        <>
          <h2>Game Over</h2>
          {state.context.winner && (<h3>Winner: {state.context.winner}</h3>)}
          {state.context.isCat && (<h3>Cat game! (tie)</h3>)}
          <button onClick={() => {send({type: 'RESET'})}}>Play Again</button>
        </>
      )}
    </main>
  );
}

export default App;
