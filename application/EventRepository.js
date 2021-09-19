const EventRepository = () => {
  const events = []

  return {
    store: event => events.push(event),
    eventsFor: gameId => events.filter(e => e.gameId === gameId)
  }
}

module.exports = EventRepository;