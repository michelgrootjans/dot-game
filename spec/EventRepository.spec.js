const TestDate = require("./TestDate");
const EventRepository = require("../application/EventRepository");
const {GameCreated} = require("../application/api/events/game");
const {IterationStarted, IterationFinished} = require("../application/api/events/iteration");

describe('EventRepository', () => {
  let events = undefined;

  beforeEach(() => events = EventRepository());
  beforeEach(TestDate.freeze);
  afterEach(TestDate.unfreeze);

  it('remembers events from current game', () => {
    events.store(GameCreated({gameId: 'g1'}));

    expect(events.eventsFor('g1')).toMatchObject([
      GameCreated({gameId: 'g1'})
    ])
    expect(events.eventsFor('g2')).toMatchObject([])
  });

  it('remembers events from current game and iteration', () => {
    events.store(GameCreated({gameId: 'g1'}));
    events.store(IterationStarted({gameId: 'g1', iterationId: 'i1'}));
    events.store(IterationFinished({gameId: 'g1', iterationId: 'i1'}));
    events.store(IterationStarted({gameId: 'g1', iterationId: 'i2'}));

    expect(events.replay('g1', 'i1')).toMatchObject([
      IterationStarted({gameId: 'g1', iterationId: 'i1'}),
      IterationFinished({gameId: 'g1', iterationId: 'i1'}),
    ])
    expect(events.replay('g1', 'i2')).toMatchObject([
      IterationStarted({gameId: 'g1', iterationId: 'i2'})
    ])
  });
});