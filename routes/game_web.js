const express = require('express');
const {v4: uuid} = require("uuid");

const {CreateGame} = require("../application/api/commands/game");
const {FindWork} = require("../application/api/commands/iteration");
const router = express.Router();

const allParams = request => ({...request.body, ...request.params});

const init = application => {
  router.post('/', function (req, res, next) {
    const gameId = req.body.gameId || uuid();
    const command = CreateGame({gameId});
    application.execute(command);
    res.redirect('/games/' + gameId)
  });

  router.get('/:gameId', function (req, res, next) {
    const gameId = allParams(req).gameId;
    const game = application.findGame(gameId)
    if (game) {
      res.render('games/index', {game});
    } else {
      res.redirect('/')
    }
  });

  router.get('/:gameId/:columnId', function (req, res, next) {
    const params = allParams(req);
    const work = application.execute(FindWork(params))
    const columnType = work.work.columnType;
    if (columnType === 'todo-column') {
      res.render('games/start-work', {work});
    } else if (columnType === 'work-column') {
      res.render('games/work', {work});
    } else if (columnType === 'test-column') {
      res.render('games/test', {work});
    } else {
      res.redirect(`/games/${params.gameId}/${work.inbox.columnId}`);
    }
  });

  return router;
}

module.exports = {init};
