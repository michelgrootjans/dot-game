const {CreateGame} = require("../application/api/commands/game");
const {StartIteration} = require("../application/api/commands/iteration");
const {TaskCreated, TaskFinished} = require("../application/api/events/task");
const TestApplication = require("./TestApplication");
const {StatsProcessManager} = require("../application/domain/StatsProcessManager");
const StatsRepository = require("../application/StatsRepository");
const EventBus = require("../application/EventBus");
const FakeTimer = require("./FakeTimer");
const {IterationStarted} = require("../application/api/events/iteration");

describe('stats end-to-end', () => {

  it("keeps history", () => {
    application = TestApplication();

    application.execute(CreateGame({gameId: 'g1'}));
    application.execute(StartIteration({gameId: 'g1', duration: 0}));

    application.advanceTime(1);
    application.publish(TaskCreated({gameId: 'g1', taskId: 't1', columnId: 'c1'}))

    application.advanceTime(1);
    application.publish(TaskFinished({gameId: 'g1', taskId: 't1'}))

    expect(application.findStats('g1').history()).toMatchObject(
      [{time: 0, wip: 0}, {time: 1, wip: 1}, {time: 2, wip: 0}],
    )
  });
});

describe('Stats Process Manager', () => {
  let stats, publish, timer;

  beforeEach(() => {
    stats = StatsRepository();
    const eventBus = EventBus();
    publish = eventBus.publish;
    timer = FakeTimer();
    StatsProcessManager().initialize(stats, eventBus.subscribe, timer.currentTime);
  });

  it("starts with a clean history", () => {
    publish(IterationStarted({gameId: 'g1'}))

    expect(stats.findStats('g1').history()).toMatchObject(
      [{time: 0, wip: 0, done: 0}],
    )
  });

  it("adds one intem", () => {
    publish(IterationStarted({gameId: 'g1'}));
    timer.advance(1);
    publish(TaskCreated({gameId: 'g1', taskId: 't1', columnId: 'c1'}))

    expect(stats.findStats('g1').history()).toMatchObject(
      [{time: 0, wip: 0, done: 0}, {time: 1, wip: 1, done: 0}],
    )
  });

  it("finish one intem", () => {
    publish(IterationStarted({gameId: 'g1'}));
    timer.advance(1);
    publish(TaskCreated({gameId: 'g1', taskId: 't1', columnId: 'c1'}))
    timer.advance(1);
    publish(TaskFinished({gameId: 'g1', taskId: 't1', columnId: 'c1'}))

    expect(stats.findStats('g1').history()).toMatchObject(
      [{time: 0, wip: 0, done: 0}, {time: 1, wip: 1, done: 0}, {time: 2, wip: 0, done: 1}],
    )
  });

  it("start a new iteration resets the stats", () => {
    publish(IterationStarted({gameId: 'g1'}));
    timer.advance(1);
    publish(TaskCreated({gameId: 'g1', taskId: 't1', columnId: 'c1'}))
    timer.advance(1);
    publish(TaskFinished({gameId: 'g1', taskId: 't1', columnId: 'c1'}))
    timer.advance(1)
    publish(IterationStarted({gameId: 'g1'}));

    expect(stats.findStats('g1').history()).toMatchObject(
      [{time: 0, wip: 0, done: 0}],
    )
  });
});
