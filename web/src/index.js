import {io} from "socket.io-client";
import {FinishIteration, StartIteration} from "./iteration";

const currentGameId = document.getElementById('gameId').value

const component = (text) => {
  const element = document.createElement('li');
  element.innerHTML = text;
  return element;
};

const socket = io();
const $events = document.getElementById('events');
const $startIterationButton = document.getElementById('start-iteration');

const handlerForEvent = event => {
  switch (event.type) {
    case 'IterationStarted': return StartIteration(event);
    case 'IterationFinished': return FinishIteration(event);
  }
  return {
    handle: () => {
    }
  }
};

socket.on('message', function (event) {
  if (event.gameId && event.gameId !== currentGameId) return;

  console.log(event);
  if (event.type === 'UserJoined') {
    $events.innerHTML = ''
  } else {
    $events.appendChild(component(JSON.stringify(event)))
  }
  handlerForEvent(event).handle(event)

});

const initializeGame = gameId => {
  $startIterationButton.addEventListener('click', () => {
    fetch(`http://localhost:3000/api/games/${gameId}/iterations`, {method: 'POST'})
  });
};

initializeGame(currentGameId);