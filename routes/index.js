var express = require('express')
var router = express.Router()

/* GET home page. */
router.get('/', function (req, res, _next) {
  res.render('index', { title: 'The Dot Game' })
})

router.get('/foodtruck', function (req, res, _next) {
  res.render('foodtruck', { title: 'The Food Truck Game' })
})

module.exports = router
