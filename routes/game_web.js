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
    const game = application.getGame(req.path.gameId)
    res.render('games/index', {title: 'The Dot Game', ...allParams(req), ...game});
  });

  return router;
}

module.exports = {init};
