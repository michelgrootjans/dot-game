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
    const params = allParams(req);
    const work = application.execute(FindWork(params))
    const columnType = work.work.columnType;
    if (columnType === 'start-column') {
      res.render('games/start-work', {work});
    } else if (columnType === 'work-column') {
      res.render('games/work', {work});
    } else {
      res.redirect(`/games/${params.gameId}/${work.inbox.columnId}`);
    }
  });

  return router;
}

module.exports = {init};
