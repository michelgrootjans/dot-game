const express = require('express');
const router = express.Router();
const {StartIteration} = require("../application/api/commands/iteration");
const { v4: uuidv4 } = require('uuid');
const {CreateGame} = require("../application/api/commands/game");

const init = application => {

  router.get('/', function(req, res, next) {
    res.send({ title: 'Dot Game v2' });
  });

  router.post('/:gameId/iteration', function (req, res, next) {
    const gameId = req.params.gameId;
    application.execute(CreateGame(gameId));
    const command = StartIteration(gameId, uuidv4());
    application.execute(command)
    res.send({params: req.params, body: req.body, iterationId: command.iterationId});
  });

  return router;
}

module.exports = {init};
