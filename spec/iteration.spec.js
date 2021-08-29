const Application = require("../application/application");
const {StartIteration, EndIteration} = require("../application/api/commands/iteration");
const {IterationStarted, IterationFinished} = require("../application/api/events/iteration");

const EventBus = () => {
  const subscribers = []
  const listeners = []

  const subscribe = (eventType, handler) => subscribers.push({eventType, handler})
  const publish = event => {
    subscribers.filter(subscriber => subscriber.eventType === event.type)
      .forEach(subscriber => subscriber.handler(event));
    listeners.forEach(listener => listener(event));
  }
  const tap = listener => listeners.push(listener)

  return {
    publish,
    subscribe,
    tap
  }
};

describe('Iteration', () => {
  let application = undefined;
  let events = undefined;

  beforeEach(function () {
    events = [];
    const eventBus = EventBus();
    eventBus.tap(event => events.push(event))
    application = Application(eventBus);
  });

  it('can start', function () {
    application.execute(StartIteration('i1'))
    expect(events).toMatchObject([
      IterationStarted('i1')
    ]);
  });

  it('can end', function () {
    application.execute(StartIteration('i1'))
    application.execute(EndIteration('i1'))
    expect(events).toMatchObject([
      IterationStarted('i1'),
      IterationFinished('i1')
    ]);
  });

  it('cannot end an unstarted iteration', function () {
    application.execute(EndIteration('i1'))
    expect(events).toMatchObject([]);
  });

  describe('Process manager', () => {
    beforeEach(jest.useFakeTimers);
    afterEach(jest.useRealTimers);

    it('ends the iteration after a timeout', function () {
      application.execute(StartIteration('i1'))
      jest.runAllTimers();
      expect(events).toMatchObject([
        IterationStarted('i1'),
        IterationFinished('i1')
      ]);
    });
  });
});

