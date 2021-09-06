import {io} from "socket.io-client";
import {FinishIteration, StartIteration} from "./iteration";
import {TaskCreated, TaskMoved} from "./task";

const currentGameId = document.getElementById('gameId').value

const socket = io();
const $startIterationButton = document.getElementById('start-iteration');
const $createTaskButton = document.getElementById('create-task');

const handlerForEvent = event => {
  console.log(event);

  switch (event.type) {
    case 'IterationStarted': return StartIteration(event);
    case 'TaskCreated': return TaskCreated(event);
    case 'TaskMoved': return TaskMoved(event);
    case 'IterationFinished': return FinishIteration(event);
  }
  return {handle: () => {}}
};

socket.on('message', function (event) {
  if (event.gameId && event.gameId !== currentGameId) return;

  handlerForEvent(event).handle(event)
});

let taskCounter = 1;
const nextTaskId = () => `${taskCounter++}`;

const initializeGame = gameId => {
  $startIterationButton.addEventListener('click', () => {
    fetch(`/api/games/${gameId}/iterations`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({duration: 60 * 1000})
    })
  });
  $createTaskButton.addEventListener('click', () => {
    fetch(`/api/games/${gameId}/tasks`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({taskId: nextTaskId()})
    })
  });
};

initializeGame(currentGameId);