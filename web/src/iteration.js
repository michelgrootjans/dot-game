const $startIterationButton = document.getElementById('start-iteration');

const StartIteration = event => {
  return {
    handle: () => $startIterationButton.disabled = true
  }
};

const FinishIteration = event => {
  return {
    handle: () => $startIterationButton.disabled = false
  }
};

module.exports = {StartIteration, FinishIteration}