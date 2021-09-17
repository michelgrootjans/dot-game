const {v4: uuid} = require("uuid");

const initialize = gameId => {
  const $createTaskButton = document.getElementById('create-task');
  if(!$createTaskButton) return;

  const enableCreation = () => $createTaskButton.disabled = false;
  const disableCreation = () => $createTaskButton.disabled = true;

  document.addEventListener('IterationStarted', enableCreation)
  document.addEventListener('IterationFinished', disableCreation)

  $createTaskButton.addEventListener('click', () => {
    disableCreation();
    setTimeout(enableCreation, 1000);
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