const { Server } = require('socket.io')
const { JoinGame, LeaveGame } = require('./application/api/commands/player')

let init = (server, events, application) => {
  const io = new Server(server)

  const publish = (event) => {
    console.log('socketapi.publish(event)', { event })
    io.to(event.gameId).emit('message', event)
  }

  io.on('connection', (socket) => {
    const { gameId, workColumnId } = socket.handshake.query

    socket.join(gameId)
    socket.emit('replay', events.eventsFor(gameId))

    if (workColumnId) {
      const game = application.findGame(gameId)
      if (game?.isColumnReserved(workColumnId)) {
        application.execute(JoinGame({ gameId, columnId: workColumnId }))
        socket.on('disconnect', () => {
          application.execute(LeaveGame({ gameId, columnId: workColumnId }))
        })
      } else {
        socket.emit('message', { type: 'ColumnTaken', gameId })
      }
    }
  })

  return { publish }
}

module.exports = { init }
