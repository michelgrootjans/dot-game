const InMemoryDatabase = require("../application/InMemoryDatabase");
const {CreateGameHandler} = require("../application/domain/gameHandlers");
const {CreateGame} = require("../application/api/commands/game");
const {StartIterationHandler} = require("../application/domain/iterationHandlers");
const {StartIteration} = require("../application/api/commands/iteration");
const EventBus = require("../application/EventBus");
const {StatsProcessManager} = require("../application/domain/StatsProcessManager");
const {TaskCreated, TaskFinished} = require("../application/api/events/task");
const Application = require("../application/Application");

describe('stats', () => {
  let given = undefined;
  let stats = undefined;

  beforeEach(() => {
    const games = InMemoryDatabase();
    const {publish, subscribe} = EventBus();
    stats = []
    const {execute} = Application({games, stats, publish, subscribe, delay: () => {}});
    execute(CreateGame({gameId: 'g1'}));
    execute(StartIteration({gameId: 'g1', duration: 0}));

    given = publish;
  });

  it('are empty in the beginning', () => {
    expect(stats).toMatchObject([
      {
        gameId: 'g1',
        wip: 0
      }
    ])
  });

  it('when 1 task has been created', () => {
    given(TaskCreated({gameId: 'g1', taskId: 't1', columnId: 'c1'}))
    expect(stats).toMatchObject([
      {
        gameId: 'g1',
        wip: 1
      }
    ])
  });

  it('when 1 task is done', () => {
    given(TaskCreated({gameId: 'g1', taskId: 't1', columnId: 'c1'}))
    given(TaskFinished({gameId: 'g1', taskId: 't1'}))
    expect(stats).toMatchObject([
      {
        gameId: 'g1',
        wip: 0
      }
    ])
  });
});

// when command
// then stats with timing