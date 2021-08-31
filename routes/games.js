const express = require('express');
const router = express.Router();
const {StartIteration} = require("../application/api/commands/iteration");
const {CreateGame} = require("../application/api/commands/game");
const {CreateTask} = require("../application/api/commands/task");
const {MoveTask} = require("../application/api/commands/task");

const init = application => {

  router.post('/', function (req, res, next) {
    const command = CreateGame({...req.body, ...req.params});
    application.execute(command);
    res.sendStatus(200);
  });

  router.post('/:gameId/iterations', function (req, res, next) {
    const command = StartIteration({duration: 5 * 60 * 1000, ...req.body, ...req.params});
    application.execute(command)
    res.sendStatus(200);
  });

  router.post('/:gameId/tasks', function (req, res, next) {
    const command = CreateTask({...req.body, ...req.params});
    application.execute(command)
    res.sendStatus(200);
  });

  router.post('/:gameId/tasks/:taskId/move', function (req, res, next) {
    const command = MoveTask(req.params.gameId, req.params.taskId);
    application.execute(command)
    res.sendStatus(200);
  });

  
  return router;
}

module.exports = {init};
