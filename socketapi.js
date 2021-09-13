const { Server } = require("socket.io");

let init = server => {
  const io = new Server(server);
  const previousEvents = []

  const publish = event => {
    console.log({message: event})
    previousEvents.push(event);
    io.emit('message', event)
  };

  io.on('connection', (socket) => {

    publish({type: 'UserJoined'});
    previousEvents.forEach(e => socket.emit('message', e));

    socket.on('disconnect', () => {
      publish({type: 'UserLeft'});
    });
  });

  return {publish}
};

module.exports = {init}