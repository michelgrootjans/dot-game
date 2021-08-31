const express = require('express');
const router = express.Router();
const {StartIteration} = require("../application/api/commands/iteration");
const {CreateGame} = require("../application/api/commands/game");
const {CreateTask} = require("../application/api/commands/task");
const {MoveTask} = require("../application/api/commands/task");

const init = application => {

  router.post('/', function (req, res, next) {
    const command = CreateGame(req.body.gameId);
    application.execute(command);
    res.send({...req.params, ...req.body, command: JSON.stringify(command)});
  });

  router.post('/:gameId/iterations', function (req, res, next) {
    const command = StartIteration(req.params.gameId, req.body.duration || 5 * 60 * 1000);
    application.execute(command)
    console.log({...req.params, ...req.body, command: JSON.stringify(command)})
    res.send({...req.params, ...req.body, command: JSON.stringify(command)});
  });

  router.post('/:gameId/tasks', function (req, res, next) {
    const command = CreateTask(req.params.gameId, req.body.taskId);
    application.execute(command)
    res.send({...req.params, ...req.body, command: JSON.stringify(command)});
  });

  router.post('/:gameId/tasks/:taskId/move', function (req, res, next) {
    const command = MoveTask(req.params.gameId, req.params.taskId);
    application.execute(command)
    res.send({...req.params, ...req.body, command: JSON.stringify(command)});
  });

  return router;
}

module.exports = {init};
