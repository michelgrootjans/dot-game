const express = require('express');
const router = express.Router();
const {StartIteration} = require("../application/api/commands/iteration");
const { v4: uuidv4 } = require('uuid');

const init = application => {
  console.log(`initialized with ${application.name}`)

  router.get('/', function(req, res, next) {
    res.send({ title: `Dot Game v2 - ${application.name}` });
  });

  router.post('/:gameId/iteration', function (req, res, next) {
    const command = StartIteration(uuidv4());
    application.execute(command)
    res.send({params: req.params, body: req.body, iterationId: command.iterationId});
  });

  return router;
}

module.exports = {init};