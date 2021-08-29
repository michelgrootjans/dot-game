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

module.exports = EventBus;