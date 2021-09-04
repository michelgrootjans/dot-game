const http = require('http');
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const socketApi = require('./socketapi')

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const Application = require("./application/Application");

const InMemoryDatabase = require("./application/InMemoryDatabase");
const exphbs = require("express-handlebars");
const EventBus = require("./application/EventBus");

const games = InMemoryDatabase();
const delay = (handler, timeout) => setTimeout(handler, timeout);
const {publish, subscribe} = EventBus();
const application = Application({games, publish, subscribe, delay});

const app = express();

// view engine setup
app.engine('handlebars', exphbs())
app.set('views', path.join(__dirname, 'web', 'views'));
app.set('view engine', 'handlebars');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'web', 'public')));
app.use(express.static(path.join(__dirname, 'web', 'dist')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/games', require('./routes/game_web').init(application))
app.use('/api/games', require('./routes/game_api').init(application))

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

var port = (process.env.PORT || '3000');
app.set('port', port);

var server = http.createServer(app);
const socket = socketApi.init(server)
subscribe('*', socket.publish);


module.exports = {server, port};
