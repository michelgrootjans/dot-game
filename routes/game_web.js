const express = require('express');
const {v4: uuid} = require("uuid");

const {CreateGame} = require("../application/api/commands/game");
const {FindWork} = require("../application/api/commands/iteration");
const router = express.Router();

const allParams = request => ({...request.body, ...request.params});
const basePath = req => req.protocol + '://' + req.get('host');

const init = application => {
  router.post('/', function (req, res, next) {
    const gameId = req.body.gameId || uuid();
    const command = CreateGame({gameId});
    application.execute(command);
    res.redirect(`/games/${gameId}/invite`)
  });

  router.get('/:gameId/invite', function (req, res, next) {
    const gameId = allParams(req).gameId;
    const game = application.findGame(gameId)
    if (game) {
      const linkForParticipants = `${basePath(req)}/games/${gameId}/join`;
      res.render('games/invite', {game, linkForParticipants, title: 'Join the Dot Game'});
    } else {
      res.redirect('/')
    }
  });

  router.get('/:gameId/join', function (req, res, next) {
    const gameId = req.params.gameId;
    const game = application.findGame(gameId);
    if (game) {
      try {
        const columnId = game.join()
        res.redirect(`/games/${game.gameId}/${columnId}`);
      } catch {
        res.status(404).send("Sorry, this game is full")
      }
    } else {
      res.redirect('/');
    }
  });

  router.get('/:gameId', function (req, res, next) {
    const gameId = allParams(req).gameId;
    const game = application.findGame(gameId)
    if (game) {
      res.render('games/index', {game, layout: 'desktop'});
    } else {
      res.redirect('/')
    }
  });

  router.get('/:gameId/:columnId', function (req, res, next) {
    const params = allParams(req);
    const work = application.execute(FindWork(params))
    const columnType = work.work.columnType;
    if (columnType === 'todo-column') {
      res.render('games/start-work', {work, layout: 'mobile', title: work.work.title});
    } else if (columnType === 'work-column') {
      res.render('games/work', {work, layout: 'mobile', title: work.work.title});
    } else if (columnType === 'test-column') {
      res.render('games/test', {work, layout: 'mobile', title: work.work.title});
    } else {
      res.status(404).send("Sorry, something went wrong");
    }
  });

  return router;
}

module.exports = {init};
