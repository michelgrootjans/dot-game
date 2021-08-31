const express = require('express');
const router = express.Router();
const {StartIteration} = require("../application/api/commands/iteration");
const {CreateGame} = require("../application/api/commands/game");
const CreateTask = require("../application/api/commands/task");

const init = application => {

  router.post('/', function (req, res, next) {
    const command = CreateGame(req.body.gameId);
    application.execute(command);
    res.send({params: req.params, body: req.body, command: JSON.stringify(command)});
  });

  router.post('/:gameId/iteration', function (req, res, next) {
    const command = StartIteration(req.params.gameId, req.body.iterationId, req.body.duration || 5 * 60 * 1000);
    application.execute(command)
    res.send({params: req.params, body: req.body, command: JSON.stringify(command)});
  });

  router.post('/:gameId/task', function (req, res, next) {
    const command = CreateTask(req.params.gameId, req.body.taskId);
    application.execute(command)
    res.send({params: req.params, body: req.body, command: JSON.stringify(command)});
  });

  return router;
}

module.exports = {init};
