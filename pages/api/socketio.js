import { Server } from 'socket.io'

const ioHandler = (req, res) => {
  if (!res.socket.server.io) {
    // console.log('*First use, starting socket.io')
    //
    // const io = new Server(res.socket.server)
    //
    // io.on('connection', socket => {
    //   socket.broadcast.emit('a user connected')
    //   socket.on('hello', msg => {
    //     socket.emit('hello', 'world!')
    //   })
    // })
    //
    // res.socket.server.io = io
    const io = new Server(res.socket.server);

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
  } else {
    console.log('socket.io already running')
  }
  res.end()
}

export const config = {
  api: {
    bodyParser: false
  }
}

export default ioHandler
