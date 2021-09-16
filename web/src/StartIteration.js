const initializeStopButton = gameId => {
  const $stopIterationButton = document.getElementById('stop-iteration');
  if (!$stopIterationButton) return;


  document.addEventListener('IterationStarted', () => $stopIterationButton.disabled = false)
  document.addEventListener('IterationFinished', () => $stopIterationButton.disabled = true)

  $stopIterationButton.addEventListener('click', () => {
    fetch(`/api/games/${gameId}/iterations/stop`, {method: 'POST'})
  });
};

const initializeStartButton = gameId => {
  const $startIterationButton = document.getElementById('start-iteration');
  if (!$startIterationButton) return;


  document.addEventListener('IterationStarted', () => $startIterationButton.disabled = true)
  document.addEventListener('IterationFinished', () => $startIterationButton.disabled = false)

  const $iterationLength = document.getElementById('iteration-length');

  $startIterationButton.addEventListener('click', () => {
    let duration = $iterationLength?.value;
    if (duration) duration = duration * 60 * 1000;

    fetch(`/api/games/${gameId}/iterations`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({duration})
    })
  });
};

const initialize = gameId => {
  initializeStartButton(gameId);
  initializeStopButton(gameId);

};

module.exports = {
  initialize
};