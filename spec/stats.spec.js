const {CreateGame} = require("../application/api/commands/game");
const {StartIteration} = require("../application/api/commands/iteration");
const {TaskCreated, TaskFinished, TaskMoved} = require("../application/api/events/task");
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
    application.publish(TaskCreated({gameId: 'g1', taskId: 't1', column: {columnId: 'c1', taskName: 'todo'}}))

    application.advanceTime(1);
    application.publish(TaskMoved({gameId: 'g1', taskId: 't1', from: {columnId: 'c1', taskName: 'todo'}, to: {columnId: 'c9', taskName: 'done'}}))

    expect(application.findStats('g1').history()).toMatchObject(
      [{time: 1, todo: 1}, {time: 2, todo: 0, done: 1}],
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
      [],
    )
  });

  it("adds one item", () => {
    publish(IterationStarted({gameId: 'g1'}));
    timer.advance(1);
    publish(TaskCreated({gameId: 'g1', taskId: 't1', column: {columnId: 'c1', taskName: 'todo'}}))

    expect(stats.findStats('g1').history()).toMatchObject(
      [{time: 1, todo: 1}],
    )
  });

  it("moves one item", () => {
    publish(IterationStarted({gameId: 'g1'}));
    timer.advance(1);
    publish(TaskCreated({gameId: 'g1', taskId: 't1', column: {columnId: 'c1', taskName: 'todo'}}))
    timer.advance(1);
    publish(TaskMoved({gameId: 'g1', taskId: 't1', from: {columnId: 'c1', taskName: 'todo'}, to: {columnId: 'c2', taskName: 'dev'}}))

    expect(stats.findStats('g1').history()).toMatchObject(
      [{time: 1, todo: 1}, {time: 2, todo: 0, dev: 1}],
    )
  });

  it("moves multiple items", () => {
    publish(IterationStarted({gameId: 'g1'}));
    timer.advance(1);
    publish(TaskCreated({gameId: 'g1', taskId: 't1', column: {columnId: 'c1', taskName: 'todo'}}))
    publish(TaskCreated({gameId: 'g1', taskId: 't2', column: {columnId: 'c1', taskName: 'todo'}}))
    publish(TaskCreated({gameId: 'g1', taskId: 't3', column: {columnId: 'c1', taskName: 'todo'}}))
    timer.advance(1);
    publish(TaskMoved({gameId: 'g1', taskId: 't1', from: {columnId: 'c1', taskName: 'todo'}, to: {columnId: 'c2', taskName: 'dev'}}))
    publish(TaskMoved({gameId: 'g1', taskId: 't2', from: {columnId: 'c1', taskName: 'todo'}, to: {columnId: 'c2', taskName: 'dev'}}))
    timer.advance(1);
    publish(TaskMoved({gameId: 'g1', taskId: 't1', from: {columnId: 'c2', taskName: 'dev'}, to: {columnId: 'c3', taskName: 'qa'}}))

    expect(stats.findStats('g1').history()).toMatchObject(
      [
        {time: 1, todo: 1}, {time: 1, todo: 2}, {time: 1, todo: 3},
        {time: 2, todo: 2, dev: 1}, {time: 2, todo: 1, dev: 2},
        {time: 3, todo: 1, dev: 1, qa: 1},
      ],
    )
  });

  it("creating an item on a new iteration", () => {
    publish(IterationStarted({gameId: 'g1'}));
    timer.advance(1);
    publish(TaskCreated({gameId: 'g1', taskId: 't1', column: {columnId: 'c1', taskName: 'todo'}}))
    timer.advance(1)
    publish(IterationStarted({gameId: 'g1'}));
    timer.advance(1)
    publish(TaskCreated({gameId: 'g1', taskId: 't2', column: {columnId: 'c1', taskName: 'todo'}}))

    expect(stats.findStats('g1').history()).toMatchObject(
      [{time: 1, todo: 1}],
    )
  });
});
