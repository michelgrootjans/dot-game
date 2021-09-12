import {io} from "socket.io-client";
import {StartIteration} from "./iteration";
import StartIterationModule from "./StartIteration";
import CreateTask from "./CreateTask";
import ProgressBar from "./ProgressBar";

const currentGameId = document.querySelector('[data-game-id]').dataset.gameId;
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
  CreateTask.initialize(gameId);
  ProgressBar.initialize(gameId);
};

initializeGame(currentGameId);