const EventRepository = () => {
  const events = []

  const store = event => events.push(event);
  const eventsFor = gameId => events.filter(e => e.gameId === gameId);
  const replay = (gameId, iterationId) => eventsFor(gameId).filter(e => e.iterationId === iterationId);

  return {
    store,
    eventsFor,
    replay,
  }
}

module.exports = EventRepository;