import { createMachine } from "xstate";
import {
  checkWin,
  isLegalMove,
  isOver,
  markSquare,
  reset,
  swapPlayer,
} from "./stateFunctions";

export const stateMachine = createMachine(
  {
    predictableActionArguments: true,
    id: "tic-tac-toe",
    initial: "init",
    context: null,
    states: {
      init: {
        always: {
          target: "playing",
          actions: "reset",
        },
      },
      playing: {
        on: {
          PLAY: {
            target: "playing",
            actions: ["markSquare", "swapPlayer", "checkWin"],
            cond: "isLegalMove",
          },
        },
        always: {
          target: "over",
          cond: "isOver",
        },
      },
      over: {
        on: {
          RESET: {
            target: "init",
          },
        },
      },
    },
  },
  {
    actions: { swapPlayer, markSquare, checkWin, reset },
    guards: { isOver, isLegalMove },
  },
);
