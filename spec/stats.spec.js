const {CreateGame} = require("../application/api/commands/game");
const {StartIteration} = require("../application/api/commands/iteration");
const {TaskCreated, TaskFinished, TaskMoved} = require("../application/api/events/task");
const TestApplication = require("./TestApplication");
const {StatsProcessManager} = require("../application/domain/StatsProcessManager");
const StatsRepository = require("../application/StatsRepository");
const EventBus = require("../application/EventBus");
const FakeTimer = require("./FakeTimer");
const {IterationStarted} = require("../application/api/events/iteration");
const {CreateTask, MoveTask} = require("../application/api/commands/task");

describe('stats end-to-end', () => {

  it("keeps history", () => {
    application = TestApplication();

    application.execute(CreateGame({gameId: 'g1'}));
    application.execute(StartIteration({gameId: 'g1'}));

    application.advanceTime(1);
    application.execute(CreateTask({gameId: 'g1', taskId: 't1'}));

    application.advanceTime(1);
    application.execute(MoveTask({gameId: 'g1', taskId: 't1'}))

    expect(application.findStats('g1').history()).toMatchObject([
        {time: 0, todo: 0, analysis: 0, design: 0, development: 0, qa: 0, done: 0},
        {time: 1, todo: 1, analysis: 0, design: 0, development: 0, qa: 0, done: 0},
        {time: 2, todo: 0, analysis: 1, design: 0, development: 0, qa: 0, done: 0}],
    )
  });
});

describe('Stats Process Manager', () => {
  let stats, publish, timer;

  const lastSat = () => {
    const history = stats.findStats('g1').history();
    return history[history.length - 1];
  };

  beforeEach(() => {
    stats = StatsRepository();
    const eventBus = EventBus();
    publish = eventBus.publish;
    timer = FakeTimer();
    StatsProcessManager().initialize(stats, eventBus.subscribe, timer.currentTime);
  });

  it("starts with a clean history", () => {
    publish(IterationStarted({gameId: 'g1', columns:[{columnId: 'c1', taskName: 'todo'}]}))

    expect(stats.findStats('g1').history()).toMatchObject(
      [{time: 0, todo: 0}],
    )
  });

  it("adds one item", () => {
    publish(IterationStarted({gameId: 'g1', columns: [{columnId: 'c1', taskName: 'todo'}]}));
    timer.advance(1);
    publish(TaskCreated({gameId: 'g1', taskId: 't1', column: {columnId: 'c1', taskName: 'todo'}}))

    expect(stats.findStats('g1').history()).toMatchObject(
      [{time: 0, todo: 0}, {time: 1, todo: 1}],
    )
  });

  it("moves one item", () => {
    publish(IterationStarted({
        gameId: 'g1', columns: [
          {columnId: 'c1', taskName: 'todo'},
          {columnId: 'c2', taskName: 'dev'}
      ]}
    ));
    timer.advance(1);
    publish(TaskCreated({gameId: 'g1', taskId: 't1', column: {columnId: 'c1', taskName: 'todo'}}))
    timer.advance(1);
    publish(TaskMoved({gameId: 'g1', taskId: 't1', from: {columnId: 'c1', taskName: 'todo'}, to: {columnId: 'c2', taskName: 'dev'}}))

    expect(stats.findStats('g1').history()).toMatchObject([
      {time: 0, todo: 0, dev: 0},
      {time: 1, todo: 1, dev: 0},
      {time: 2, todo: 0, dev: 1}],
    )
  });

  it("moves multiple items", () => {
    publish(IterationStarted({
      gameId: 'g1', columns: [
        {columnId: 'c1', taskName: 'todo'},
        {columnId: 'c2', taskName: 'dev'},
        {columnId: 'c2', taskName: 'qa'},
      ]}
    ));
    expect(lastSat()).toMatchObject({time: 0, todo: 0, dev: 0, qa: 0})

    timer.advance(1);
    publish(TaskCreated({gameId: 'g1', taskId: 't1', column: {columnId: 'c1', taskName: 'todo'}}))
    expect(lastSat()).toMatchObject({time: 1, todo: 1, dev: 0, qa: 0})
    publish(TaskCreated({gameId: 'g1', taskId: 't2', column: {columnId: 'c1', taskName: 'todo'}}))
    expect(lastSat()).toMatchObject({time: 1, todo: 2, dev: 0, qa: 0})
    publish(TaskCreated({gameId: 'g1', taskId: 't3', column: {columnId: 'c1', taskName: 'todo'}}))
    expect(lastSat()).toMatchObject({time: 1, todo: 3, dev: 0, qa: 0})

    timer.advance(1);
    publish(TaskMoved({gameId: 'g1', taskId: 't1', from: {columnId: 'c1', taskName: 'todo'}, to: {columnId: 'c2', taskName: 'dev'}}))
    expect(lastSat()).toMatchObject({time: 2, todo: 2, dev: 1, qa: 0})
    publish(TaskMoved({gameId: 'g1', taskId: 't2', from: {columnId: 'c1', taskName: 'todo'}, to: {columnId: 'c2', taskName: 'dev'}}))
    expect(lastSat()).toMatchObject({time: 2, todo: 1, dev: 2, qa: 0})

    timer.advance(1);
    publish(TaskMoved({gameId: 'g1', taskId: 't1', from: {columnId: 'c2', taskName: 'dev'}, to: {columnId: 'c3', taskName: 'qa'}}))
    expect(lastSat()).toMatchObject({time: 3, todo: 1, dev: 1, qa: 1})
  });

  it("creating an item on a second iteration", () => {
    publish(IterationStarted({gameId: 'g1', columns: [{columnId: 'c1', taskName: 'todo'}]}));
    timer.advance(1);
    publish(TaskCreated({gameId: 'g1', taskId: 't1', column: {columnId: 'c1', taskName: 'todo'}}))
    timer.advance(1)
    publish(IterationStarted({gameId: 'g1'}));
    timer.advance(1)
    publish(TaskCreated({gameId: 'g1', taskId: 't2', column: {columnId: 'c1', taskName: 'todo'}}))

    expect(stats.findStats('g1').history()).toMatchObject(
      [{time: 0, todo: 0}, {time: 1, todo: 1}],
    )
  });
});
