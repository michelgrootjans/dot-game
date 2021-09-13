const initialize = gameId => {
  const $startIterationButton = document.getElementById('start-iteration');
  if(!$startIterationButton) return;


  document.addEventListener('IterationStarted', () => $startIterationButton.disabled = true)
  document.addEventListener('IterationFinished', () => $startIterationButton.disabled = false)

  const $iterationLength = document.getElementById('iteration-length');

  $startIterationButton.addEventListener('click', () => {
    let duration = $iterationLength?.value;
    if(duration) duration = duration * 60 * 1000;
    console.log({duration})

    fetch(`/api/games/${gameId}/iterations`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({duration})
    })
  });

};

module.exports = {
  initialize
};