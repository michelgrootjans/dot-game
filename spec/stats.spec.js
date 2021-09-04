const GameRepository = require("../application/GameRepository");
const {CreateGame} = require("../application/api/commands/game");
const {StartIteration} = require("../application/api/commands/iteration");
const EventBus = require("../application/EventBus");
const {TaskCreated, TaskFinished} = require("../application/api/events/task");
const Application = require("../application/Application");
const FakeTimer = require("./FakeTimer");

describe('stats end-to-end', () => {

  it("keeps history", () => {
    const games = GameRepository();
    const {publish, subscribe} = EventBus();
    let stats = [];
    const timer = FakeTimer()
    const {execute, findStats} = Application({
      games, stats, publish, subscribe,
      delay: () => {
      },
      currentTime: timer.currentTime
    });


    execute(CreateGame({gameId: 'g1'}));
    execute(StartIteration({gameId: 'g1', duration: 0}));

    timer.advance(1);
    publish(TaskCreated({gameId: 'g1', taskId: 't1', columnId: 'c1'}))

    timer.advance(1);
    publish(TaskFinished({gameId: 'g1', taskId: 't1'}))

    expect(findStats('g1')).toMatchObject({
      history: [{time: 0, wip: 0}, {time: 1, wip: 1}, {time: 2, wip: 0}],
    })
  });
});

// when command
// then stats with timing