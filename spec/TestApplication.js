const GamesRepository = require("../application/GameRepository");
const StatsRepository = require("../application/StatsRepository");
const EventBus = require("../application/EventBus");
const Application = require("../application/Application");

const TestApplication = () => {
  const games = GamesRepository();
  const stats = StatsRepository();
  const {publish, subscribe} = EventBus();
  const delay = () => {};
  const application = Application({games, stats, publish, subscribe, delay});

  return {
    publish,
    execute: application.execute,
    subscribe: application.subscribe,
    findGame: games.find,
    findStats: stats.find,
  };
};


module.exports = TestApplication;