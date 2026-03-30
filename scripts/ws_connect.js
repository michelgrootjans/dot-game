#!/usr/bin/env node

// Connects to the game server as a player and holds the WebSocket open.
// Usage: node ws_connect.js <baseUrl> <gameId> <columnId>
//
// On ColumnTaken: follows the /join redirect chain to find the next available
// column, prints it, and exits. Exits cleanly on SIGTERM/SIGINT.

const { io } = require('socket.io-client')
const http = require('http')
const https = require('https')

const [,, baseUrl, gameId, columnId] = process.argv

if (!baseUrl || !gameId || !columnId) {
  console.error('Usage: ws_connect.js <baseUrl> <gameId> <columnId>')
  process.exit(1)
}

const followRedirects = (url, callback) => {
  const lib = url.startsWith('https') ? https : http
  lib.get(url, (res) => {
    res.resume()
    if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
      const next = res.headers.location.startsWith('http')
        ? res.headers.location
        : new URL(res.headers.location, url).href
      followRedirects(next, callback)
    } else {
      callback(url, res.statusCode)
    }
  }).on('error', () => callback(url, null))
}

const socket = io(baseUrl, { query: { gameId, workColumnId: columnId }, transports: ['websocket'] })

socket.on('connect', () =>
  console.log(`[ws] connected  game=${gameId} column=${columnId}`)
)

socket.on('message', (event) => {
  if (event.type === 'ColumnTaken') {
    console.log(`[ws] column taken, retrying...`)
    socket.disconnect()
    followRedirects(`${baseUrl}/games/${gameId}/join`, (finalUrl, status) => {
      if (status === 404) {
        console.log(`[ws] game full`)
      } else {
        console.log(`[ws] reassigned to: ${finalUrl}`)
      }
      process.exit(0)
    })
  }
})

socket.on('disconnect', (reason) =>
  console.log(`[ws] disconnected game=${gameId} column=${columnId} reason=${reason}`)
)

const disconnect = () => {
  socket.disconnect()
  process.exit(0)
}

process.on('SIGTERM', disconnect)
process.on('SIGINT', disconnect)
