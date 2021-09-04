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
  let currentTime = undefined;

  beforeEach(() => {
    currentTime = 0;
    const games = InMemoryDatabase();
    const {publish, subscribe} = EventBus();
    stats = []
    const {execute} = Application({
      games, stats, publish, subscribe, delay: () => {
      }, currentTime: () => currentTime
    });
    execute(CreateGame({gameId: 'g1'}));
    execute(StartIteration({gameId: 'g1', duration: 0}));

    given = publish;
  });

  it('are empty in the beginning', () => {
    expect(stats).toMatchObject([
      {
        gameId: 'g1',
        history: [{time: 0, wip: 0}],
      }
    ])
  });

  it('when 1 task has been created', () => {
    currentTime = 1000;
    given(TaskCreated({gameId: 'g1', taskId: 't1', columnId: 'c1'}))
    expect(stats).toMatchObject([
      {
        history: [{time: 0, wip: 0}, {time: 1, wip: 1}],
      }
    ])
  });

  it('when 1 task is done', () => {
    currentTime = 1000;
    given(TaskCreated({gameId: 'g1', taskId: 't1', columnId: 'c1'}))
    currentTime = 2000;
    given(TaskFinished({gameId: 'g1', taskId: 't1'}))
    expect(stats).toMatchObject([
      {
        history: [{time: 0, wip: 0}, {time: 1, wip: 1}, {time: 2, wip: 0}],
      }
    ])
  });
});

// when command
// then stats with timing