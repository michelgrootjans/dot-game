const Delayer = ({fake = false}) => {
  const delay = (handler, timeout) => {
    // if (fake) {
    //   handler()
    // } else {
      setTimeout(handler, timeout);
    // }
  };

  return {
    delay
  }
};

module.exports = Delayer;