const API = require("./API");

const initialize = (gameId, subscribe) => {
  const $createTaskButton = document.getElementById('create-task');
  if(!$createTaskButton) return;

  const enableCreation = () => $createTaskButton.disabled = false;
  const disableCreation = () => $createTaskButton.disabled = true;

  subscribe('IterationStarted', enableCreation)
  subscribe('IterationFinished', disableCreation)

  $createTaskButton.addEventListener('click', () => {
    disableCreation();
    setTimeout(enableCreation, 1000);
    API(gameId).task.create();
  });
};

module.exports = {
  initialize
};