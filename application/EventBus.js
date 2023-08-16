const EventBus = () => {
  const subscribers = []

  const subscribe = (eventType, handler) => subscribers.push({ eventType, handler })
  const publish = (event) => {
    subscribers.filter((subscriber) => [event.type, '*'].includes(subscriber.eventType)).forEach((subscriber) => subscriber.handler(event))
  }

  return {
    publish,
    subscribe,
  }
}

module.exports = EventBus
