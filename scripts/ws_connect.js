#!/usr/bin/env node

// Connects to the game server as a player and holds the WebSocket open.
// Usage: node ws_connect.js <baseUrl> <gameId> <columnId>
//
// Exits cleanly on SIGTERM/SIGINT, which triggers the server-side LeaveGame.

const { io } = require('socket.io-client')

const [,, baseUrl, gameId, columnId] = process.argv

if (!baseUrl || !gameId || !columnId) {
  console.error('Usage: ws_connect.js <baseUrl> <gameId> <columnId>')
  process.exit(1)
}

const socket = io(baseUrl, { query: { gameId, workColumnId: columnId } })

socket.on('connect', () =>
  console.log(`[ws] connected  game=${gameId} column=${columnId}`)
)
socket.on('disconnect', (reason) =>
  console.log(`[ws] disconnected game=${gameId} column=${columnId} reason=${reason}`)
)

const disconnect = () => {
  socket.disconnect()
  process.exit(0)
}

process.on('SIGTERM', disconnect)
process.on('SIGINT', disconnect)
