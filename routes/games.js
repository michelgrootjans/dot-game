const express = require('express');
const router = express.Router();
const {StartIteration} = require("../application/api/commands/iteration");
const {CreateGame} = require("../application/api/commands/game");
const {CreateTask} = require("../application/api/commands/task");
const {MoveTask} = require("../application/api/commands/task");

const allParams = request => ({...request.body, ...request.params});

const init = application => {

  router.post('/', function (req, res, next) {
    const command = CreateGame(allParams(req));
    application.execute(command);
    res.sendStatus(200);
  });

  router.post('/:gameId/iterations', function (req, res, next) {
    const command = StartIteration({duration: 5 * 60 * 1000, ...allParams(req)});
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
