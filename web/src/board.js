import {io} from "socket.io-client";
import {FinishIteration, StartIteration} from "./iteration";
import {TaskCreated, TaskMoved} from "./task";
import CreateTask from "./CreateTask";

const currentGameId = document.querySelector('[data-game-id]').dataset.gameId;
const $startIterationButton = document.getElementById('start-iteration');
const socket = io();

const handlerForEvent = event => {
  console.log(event);

  switch (event.type) {
    case 'IterationStarted': return StartIteration();
    case 'TaskCreated': return TaskCreated();
    case 'TaskMoved': return TaskMoved();
    case 'IterationFinished': return FinishIteration();
  }
  return {handle: () => {}}
};

socket.on('message', function (event) {
  if (event.gameId && event.gameId !== currentGameId) return;

  document.dispatchEvent(new CustomEvent(event.type, { detail: event }))
  handlerForEvent(event).handle(event)
});

const initializeGame = gameId => {
  $startIterationButton.addEventListener('click', () => {
    fetch(`/api/games/${gameId}/iterations`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({duration: 60 * 1000})
    })
  });
  CreateTask.initialize(gameId);
};

initializeGame(currentGameId);