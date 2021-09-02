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
    const game = application.getGame(gameId)
    if (game) {
      res.render('games/index', {game});
    } else {
      res.status(404).send('game not found')
    }
  });

  return router;
}

module.exports = {init};
