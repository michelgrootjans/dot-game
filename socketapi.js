const { Server } = require("socket.io");

let init = (server, events) => {
  const io = new Server(server);

  const publish = event => {
    console.log({event})
    io.to(event.gameId).emit('message', event)
  };

  io.on('connection', (socket) => {
    const gameId = socket.handshake.query.gameId;
    socket.join(gameId)
    events.eventsFor(gameId)
      .forEach(event => socket.emit('message', event));
  });

  return {publish}
};

module.exports = {init}