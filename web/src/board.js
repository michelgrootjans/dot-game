import {io} from "socket.io-client";
import {StartIteration} from "./iteration";
import CreateTask from "./CreateTask";
import StartIterationModule from "./StartIteration";
import ProgressBar from "./ProgressBar";
import Columns from "./Column";

const currentGameId = document.querySelector('[data-game-id]').dataset.gameId;
const $startIterationButton = document.getElementById('start-iteration');
const socket = io();

const handlerForEvent = event => {
  console.log(event);

  switch (event.type) {
    case 'IterationStarted': return StartIteration();
  }
  return {handle: () => {}}
};

socket.on('message', function (event) {
  if (event.gameId && event.gameId !== currentGameId) return;

  document.dispatchEvent(new CustomEvent(event.type, { detail: event }))
  handlerForEvent(event).handle(event)
});

const initializeGame = gameId => {
  StartIterationModule.initialize(gameId);
  Columns.initialize()
  CreateTask.initialize(gameId);
  ProgressBar.initialize(gameId);
};

initializeGame(currentGameId);