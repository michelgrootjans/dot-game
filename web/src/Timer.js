const Timer = (duration, timeout = 1000) => {
  const startTime = new Date();

  return {
    start: (handler) => {
      const timerHandle = setInterval(() => {
        const timeLeft = new Date() - startTime;
        if (duration <= timeLeft) clearInterval(timerHandle);
        handler(timeLeft)
      }, timeout);
    }
  }
};

module.exports = Timer;