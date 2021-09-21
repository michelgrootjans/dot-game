const API = require("./API");

const initializeStopButton = (gameId, subscribe) => {
  const $stopIterationButton = document.getElementById('stop-iteration');
  if (!$stopIterationButton) return;


  subscribe('IterationStarted', () => $stopIterationButton.disabled = false)
  subscribe('IterationFinished', () => $stopIterationButton.disabled = true)

  $stopIterationButton.addEventListener('click', () => API(gameId).iteration.stop());
};

const initializeStartButton = (gameId, subscribe) => {
  const $startIterationButton = document.getElementById('start-iteration');
  if (!$startIterationButton) return;


  subscribe('IterationStarted', () => $startIterationButton.disabled = true)
  subscribe('IterationFinished', () => $startIterationButton.disabled = false)

  const $iterationLength = document.getElementById('iteration-length');

  $startIterationButton.addEventListener('click', () => {
    let duration = $iterationLength?.value;
    if (duration) duration = duration * 60 * 1000;

    API(gameId).iteration.start({duration})
  });
};

const initialize = (gameId, subscribe) => {
  initializeStartButton(gameId, subscribe);
  initializeStopButton(gameId, subscribe);
};

module.exports = {
  initialize
};