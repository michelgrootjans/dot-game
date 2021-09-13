const Timer = (duration, timeout = 1000) => {
  const endTime = Date.now() + parseInt(duration);

  return {
    start: (handler) => {
      handler()
      const timerHandle = setInterval(() => {
        handler()
        console.log('tick')
        const currentTime = Date.now();
        if (endTime < currentTime) clearInterval(timerHandle);
      }, timeout);
      return {
        stop: () => {
          handler()
          clearInterval(timerHandle)
        }
      }
    }}
};

module.exports = Timer;