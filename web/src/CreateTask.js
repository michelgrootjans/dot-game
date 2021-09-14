const {v4: uuid} = require("uuid");

const initialize = gameId => {
  const $createTaskButton = document.getElementById('create-task');
  if(!$createTaskButton) return;

  const enableCreateion = () => $createTaskButton.disabled = false;
  const disableCreateion = () => $createTaskButton.disabled = true;

  document.addEventListener('IterationStarted', enableCreateion)
  document.addEventListener('IterationFinished', disableCreateion)

  $createTaskButton.addEventListener('click', () => {
    disableCreateion();
    setTimeout(enableCreateion, 1000);
    fetch(`/api/games/${gameId}/tasks`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({taskId: uuid()})
    })
  });
};

module.exports = {
  initialize
};