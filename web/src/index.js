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

const initializeGame = (gameId) => {
  StartIteration.initialize(gameId);
  CreateTask.initialize(gameId);
  Columns.initialize();
  Workspace.initialize();
  Testing.initialize();
  Charts.initialize(gameId);
  ProgressBar.initialize();
  IterationStats.initialize(gameId);

  Simulations.initialize(gameId);
};

const gameId = document.querySelector('[data-game-id]').dataset.gameId;
initializeGame(gameId);
const socket = io({query: {gameId}});

const publish = event => {
  console.log(event);
  document.dispatchEvent(new CustomEvent(event.type, {detail: event}));
};

socket.on('message', event => publish(event));
socket.on('replay', events => events.forEach(event => publish(event)));
