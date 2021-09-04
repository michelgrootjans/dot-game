const InMemoryDatabase = require("../application/InMemoryDatabase");
const {CreateGameHandler} = require("../application/domain/gameHandlers");
const {CreateGame} = require("../application/api/commands/game");
const {StartIterationHandler} = require("../application/domain/iterationHandlers");
const {StartIteration} = require("../application/api/commands/iteration");
describe('stats', () => {

  it('should work', () => {
    const games = InMemoryDatabase();
    CreateGameHandler(games, () => {}).execute(CreateGame({gameId: 'g1'}))
    StartIterationHandler(games, () => {}).execute(StartIteration({gameId: 'g1', duration: 0}))

  });
});

// when command
// then stats with timing