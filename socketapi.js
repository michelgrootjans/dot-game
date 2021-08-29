const { Server } = require("socket.io");

let init = server => {
  const io = new Server(server);

  io.on('connection', (socket) => {
    const publish = message => {
      console.log({message, clientId: socket.client.id, id: socket.id})
      io.emit('message', message)
    };

    publish('a user joined');

    socket.on('disconnect', () => {
      publish('a user left');
    });
  });

};


module.exports = {init}