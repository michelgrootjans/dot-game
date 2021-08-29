var express = require('express');
var router = express.Router();

const init = application => {
  console.log(`initialized with ${application.name}`)

  router.get('/', function(req, res, next) {
    console.log(`called with ${application.name}`)
    res.send({ title: `Dot Game v2 - ${application.name}` });
  });

  return router;
}

module.exports = {init};
