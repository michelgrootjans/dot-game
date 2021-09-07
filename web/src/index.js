import {io} from "socket.io-client";
import {FinishIteration, StartIteration} from "./iteration";
import {TaskCreated, TaskMoved} from "./task";
import {v4 as uuidv4} from 'uuid';

const currentGameId = document.getElementById('gameId').value
const $startIterationButton = document.getElementById('start-iteration');
const $createTaskButton = document.getElementById('create-task');
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

  handlerForEvent(event).handle(event)
});

const initializeGame = gameId => {
  $startIterationButton.addEventListener('click', () => {
    fetch(`/api/games/${gameId}/iterations`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({duration: 30 * 1000})
    })
  });
  $createTaskButton.addEventListener('click', () => {
    fetch(`/api/games/${gameId}/tasks`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({taskId: uuidv4()})
    })
  });
};

initializeGame(currentGameId);