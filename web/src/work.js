import {io} from "socket.io-client";
import {FinishIteration, StartIteration} from "./iteration";
import {TaskCreated, TaskMoved} from "./task";

const currentGameId = document.querySelector('[data-game-id]').dataset.gameId;
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
