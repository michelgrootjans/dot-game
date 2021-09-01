import { io } from "socket.io-client";

const currentGameId = document.getElementById('gameId').value

const component = (text) => {
  const element = document.createElement('li');
  element.innerHTML = text;
  return element;
};

const socket = io();
const $events = document.getElementById('events');

socket.on('message', function (event) {
  if (event.gameId && event.gameId !== currentGameId) return;

  console.log(event);
  if (event.type === 'UserJoined') {
    $events.innerHTML = ''
  } else {
    $events.appendChild(component(JSON.stringify(event)))
  }
});

