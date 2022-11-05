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
        className='game-container container'
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
        <div className='container info'>
          <span className='next-player'>Next player: {state.context.player}</span>
        </div>
      )}
      {state.value === 'over' && (
        <div className='container info'>
          {state.context.winner && (<h2>Winner: {state.context.winner}</h2>)}
          {state.context.isCat && (<h3>Cat game! (tie)</h3>)}
          <button className='reset-button' onClick={() => {send({type: 'RESET'})}}>Play Again</button>
        </div>
      )}
    </main>
  );
}

export default App;
