const initialize = gameId => {
  const $startIterationButton = document.getElementById('start-iteration');
  if(!$startIterationButton) return;

  document.addEventListener('IterationStarted', () => $startIterationButton.disabled = true)
  document.addEventListener('IterationFinished', () => $startIterationButton.disabled = false)

  $startIterationButton.addEventListener('click', () => {
    fetch(`/api/games/${gameId}/iterations`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({duration: 60 * 1000})
    })
  });

};

module.exports = {
  initialize
};