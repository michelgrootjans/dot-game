const { Server } = require("socket.io");


const EventSource = () => {
  const previousEvents = []

  return {
    store: event => previousEvents.push(event),
    eventsFor: gameId => previousEvents.filter(e => e.gameId === gameId)
  }
}



let init = server => {
  const events = EventSource();

  const io = new Server(server);

  const publish = event => {
    console.log({event})
    events.store(event);
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