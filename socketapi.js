const {Server} = require("socket.io");

let init = (server, events, application) => {
  const io = new Server(server);

  const publish = event => {
    console.log({event})
    io.to(event.gameId).emit('message', event)
  };

  io.on('connection', (socket) => {
    const {gameId, workColumnId} = socket.handshake.query;

    socket.join(gameId)
    socket.emit('replay', events.eventsFor(gameId));

    console.log('connection', {gameId, workColumnId})

    if (workColumnId) {
      // application.execute({type: 'JoinGame', gameId, workColumnId})
      const joined = {type: 'PlayerJoined', gameId, workColumnId};
      publish(joined);
      socket.on('disconnect', () => {
        const left = {type: 'PlayerLeft', gameId, workColumnId};
        publish(left)
      });
    }
  });

  return {publish}
};

module.exports = {init}