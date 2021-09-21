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
import EventBus from "./EventBus";

const initializeGame = (gameId, subscribe) => {
  StartIteration.initialize(gameId, subscribe);
  CreateTask.initialize(gameId, subscribe);
  Columns.initialize(subscribe);
  Workspace.initialize(subscribe);
  Testing.initialize();
  Charts.initialize(gameId);
  ProgressBar.initialize();
  IterationStats.initialize(gameId);

  Simulations.initialize(gameId);
};

const eventBus = EventBus();

const publish = event => {
  console.log(event);
  document.dispatchEvent(new CustomEvent(event.type, {detail: event}))
  eventBus.publish(event);
};

const gameId = document.querySelector('[data-game-id]').dataset.gameId;
initializeGame(gameId, eventBus.subscribe);

const socket = io({query: {gameId}});

socket.on('message', event => publish(event));
socket.on('replay', events => events.forEach(event => publish(event)));
