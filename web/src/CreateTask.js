const API = require("./API");

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
    API(gameId).task.create();
  });
};

module.exports = {
  initialize
};