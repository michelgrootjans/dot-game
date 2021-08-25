const { Server } = require("socket.io");

let init = server => {
  const io = new Server(server);

  const publish = message => {
    console.log(message);
    io.emit('message', message)
  };

  io.on('connection', (socket) => {
    publish('a user joined');

    socket.on('disconnect', () => {
      publish('a user left');
    });
  });

};


module.exports = {init}