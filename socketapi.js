const { Server } = require("socket.io");

let init = server => {
  const io = new Server(server);

  const publish = event => {
    console.log({message: event})
    io.emit('message', event)
  };

  io.on('connection', (socket) => {

    publish({type: 'UserJoined'});

    socket.on('disconnect', () => {
      publish({type: 'UserLeft'});
    });
  });

  return {publish}
};

module.exports = {init}