const express = require('express');
const {CreateGame} = require("../application/api/commands/game");
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
      res.status(404).send('games not found')
    }
  });

  router.get('/:gameId/:columnId', function (req, res, next) {
    const params = allParams(req);
    const column = application.findColumn(params.gameId, params.columnId)
    res.render('games/work', {column});
  });

  return router;
}

module.exports = {init};
