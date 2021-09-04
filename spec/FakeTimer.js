const FakeTimer = () => {
  let time = 0;
  const currentTime = () => time;
  return {
    currentTime,
    advance: amount => time += amount*1000
  }
};

module.exports = FakeTimer;