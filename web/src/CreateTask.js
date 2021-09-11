const {v4: uuid} = require("uuid");

const initialize = gameId => {
  const $createTaskButton = document.getElementById('create-task');
  if(!$createTaskButton) return;

  document.addEventListener('IterationStarted', () => $createTaskButton.disabled = false)
  document.addEventListener('IterationFinished', () => $createTaskButton.disabled = true)

  $createTaskButton.addEventListener('click', () => {
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