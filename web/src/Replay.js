const Replay = {
  initialize: (gameId, socket) => {
    document.addEventListener('ReplayRequested', ({ detail }) => {
      socket.emit('replay', { gameId, iterationId: detail.iterationId })
    })
  },
}

module.exports = Replay
