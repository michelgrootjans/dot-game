const GamesRepository = require("../application/GameRepository");
const StatsRepository = require("../application/StatsRepository");
const EventBus = require("../application/EventBus");
const Application = require("../application/Application");
const FakeTimer = require("./FakeTimer");

const TestApplication = () => {
  const games = GamesRepository();
  const stats = StatsRepository();
  const {publish, subscribe} = EventBus();
  const delay = () => {};
  const timer = FakeTimer();
  const application = Application({games, stats, publish, subscribe, delay, currentTime: timer.currentTime});

  return {
    publish,
    execute: application.execute,
    subscribe: application.subscribe,
    currentTime: timer.currentTime,
    advanceTime: timer.advance,
    findGame: games.find,
    findStats: stats.find,
  };
};


module.exports = TestApplication;