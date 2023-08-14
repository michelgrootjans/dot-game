const EventRepository = () => {
  const events = []

  const store = (event) => events.push(event)
  const eventsFor = (gameId) => events.filter((e) => e.gameId === gameId)

  return {
    store,
    eventsFor,
  }
}

module.exports = EventRepository
