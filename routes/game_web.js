const express = require('express')

const { CreateGame } = require('../application/api/commands/game')
const { FindWork } = require('../application/api/commands/iteration')
const router = express.Router()

const allParams = (request) => ({ ...request.body, ...request.params })
const basePath = (req) => req.protocol + '://' + req.get('host')

const init = (application) => {
  router.post('/', function (req, res, next) {
    const command = CreateGame(req.body)
    application.execute(command)
    res.redirect(`/games/${command.gameId}/invite`)
  })

  router.get('/:gameId/invite', function (req, res, next) {
    const gameId = allParams(req).gameId
    const game = application.findGame(gameId)
    if (game) {
      const linkForParticipants = `${basePath(req)}/games/${gameId}/join`
      res.render('games/invite', {
        game,
        linkForParticipants,
        layout: 'desktop',
        title: 'Join the Dot Game',
      })
    } else {
      res.status(404).render('games/not-found', { layout: 'desktop', title: 'Game Not Found' })
    }
  })

  router.get('/:gameId/join', function (req, res, next) {
    const gameId = req.params.gameId
    const game = application.findGame(gameId)
    if (!game) {
      res.status(404).render('games/not-found', { layout: 'mobile', title: 'Game Not Found' })
      return
    }
    res.redirect(`/games/${gameId}/${game.playerColumns[0].columnId}`)
  })

  router.get('/:gameId', function (req, res, next) {
    const gameId = allParams(req).gameId
    const game = application.findGame(gameId)
    if (game) {
      res.render('games/index', { game, layout: 'desktop' })
    } else {
      res.status(404).render('games/not-found', { layout: 'desktop', title: 'Game Not Found' })
    }
  })

  router.get('/:gameId/full', function (req, res, next) {
    const gameId = req.params.gameId
    const game = application.findGame(gameId)
    if (!game) {
      res.status(404).render('games/not-found', { layout: 'mobile', title: 'Game Not Found' })
      return
    }
    res.render('games/full', { layout: 'mobile', title: 'Game Full', gameId })
  })

  router.get('/:gameId/:columnId', function (req, res, next) {
    const params = allParams(req)
    const { gameId, columnId } = params
    const game = application.findGame(gameId)

    if (!game) {
      res.status(404).render('games/not-found', { layout: 'mobile', title: 'Game Not Found' })
      return
    }

    const playerColumn = game.playerColumns.find((c) => c.columnId === columnId)
    if (playerColumn) {
      if (playerColumn.isOpen()) {
        playerColumn.reserve(5000)
      } else {
        const next = game.nextPlayerColumn(columnId)
        if (next) {
          res.redirect(`/games/${gameId}/${next.columnId}`)
        } else {
          res.redirect(`/games/${gameId}/full`)
        }
        return
      }
    }

    const work = application.execute(FindWork(params))
    if (!work) {
      res.status(404).send('This game does not exist.')
      return
    }

    const columnType = work.work.columnType
    if (columnType === 'todo-column') {
      res.render('games/start-work', {
        work,
        layout: 'mobile',
        title: work.work.title,
      })
    } else if (columnType === 'work-column') {
      res.render('games/work', {
        work,
        layout: 'mobile',
        title: work.work.title,
      })
    } else if (columnType === 'test-column') {
      res.render('games/test', {
        work,
        layout: 'mobile',
        title: work.work.title,
      })
    } else {
      res.status(404).send('Sorry, something went wrong')
    }
  })

  return router
}

module.exports = { init }
