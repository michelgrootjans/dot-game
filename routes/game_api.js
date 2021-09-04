const express = require('express');
const router = express.Router();
const {StartIteration} = require("../application/api/commands/iteration");
const {CreateGame} = require("../application/api/commands/game");
const {CreateTask} = require("../application/api/commands/task");
const {MoveTask} = require("../application/api/commands/task");
const path = require("path");

const allParams = request => ({...request.body, ...request.params});

const init = application => {

  router.post('/', function (req, res, next) {
    const gameId = allParams(req).gameId;
    const command = CreateGame(gameId);
    application.execute(command);
    res.sendStatus(200);
  });

  router.get('/:gameId/stats', function (req, res, next) {
    const gameId = req.params.gameId;
    const stats = application.findStats(gameId);
    console.log({gameId, stats})
    res.send(stats);
  });

  router.post('/:gameId/iterations', function (req, res, next) {
    const command = StartIteration(allParams(req));
    application.execute(command)
    res.sendStatus(200);
  });

  router.post('/:gameId/tasks', function (req, res, next) {
    const command = CreateTask(allParams(req));
    application.execute(command)
    res.sendStatus(200);
  });

  router.post('/:gameId/tasks/:taskId/move', function (req, res, next) {
    const command = MoveTask(allParams(req));
    application.execute(command)
    res.sendStatus(200);
  });

  return router;
}

module.exports = {init};
