const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

const publish = message => {
  console.log(message);
  io.emit('message', message)
};

let numberOfUsers = 0;
setInterval(() => publish(`${numberOfUsers} users are online`), 2000);

io.on('connection', (socket) => {
  numberOfUsers++;
  publish('a user joined');

  socket.on('disconnect', () => {
    numberOfUsers--;
    publish('a user left');
  });
});

server.listen(3000, () => {
  console.log('listening on *:3000');
});