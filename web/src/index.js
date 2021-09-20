import {io} from "socket.io-client";
import CreateTask from "./CreateTask";
import StartIteration from "./StartIteration";
import ProgressBar from "./ProgressBar";
import Columns from "./Column";
import Charts from './Charts';
import Workspace from "./Workspace";
import IterationStats from "./IterationStats";
import Testing from "./Testing";
import Simulations from "./Simulations";
import Replay from "./Replay";

const initializeGame = (gameId, socket) => {
  StartIteration.initialize(gameId);
  CreateTask.initialize(gameId);
  Columns.initialize();
  Workspace.initialize();
  Testing.initialize();
  Charts.initialize(gameId);
  ProgressBar.initialize();
  IterationStats.initialize(gameId);

  Simulations.initialize(gameId);
  Replay.initialize(gameId, socket);
};

const gameId = document.querySelector('[data-game-id]').dataset.gameId;
const socket = io({query: {gameId}});
initializeGame(gameId, socket);

socket.on('message', event => {
  console.log(event);

  document.dispatchEvent(new CustomEvent(event.type, { detail: event }))
});
