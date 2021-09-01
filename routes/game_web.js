const express = require('express');
const {CreateGame} = require("../application/api/commands/game");
const router = express.Router();

const allParams = request => ({...request.body, ...request.params});

const init = application => {
  router.get('/:gameId', function (req, res, next) {
    res.render('games/index', {title: 'The Dot Game', ...allParams(req)});
  });

  router.post('/', function (req, res, next) {
    const command = CreateGame(allParams(req));
    application.execute(command);
    res.redirect('/games/' + req.body.gameId)
  });

  return router;
}

module.exports = {init};
