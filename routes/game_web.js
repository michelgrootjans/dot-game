const express = require('express');
const {CreateGame} = require("../application/api/commands/game");
const {FindWork} = require("../application/api/commands/iteration");
const router = express.Router();

const allParams = request => ({...request.body, ...request.params});

const init = application => {
  router.post('/', function (req, res, next) {
    const command = CreateGame(allParams(req));
    application.execute(command);
    res.redirect('/games/' + req.body.gameId)
  });

  router.get('/:gameId', function (req, res, next) {
    const gameId = allParams(req).gameId;
    const game = application.findGame(gameId)
    if (game) {
      res.render('games/index', {game});
    } else {
      res.status(404).send('game not found')
    }
  });

  router.get('/:gameId/:columnId', function (req, res, next) {
    const work = application.execute(FindWork(allParams(req)))
    console.log({columnType: work.work.columnType})
    res.render('games/work', {work});
  });

  return router;
}

module.exports = {init};
