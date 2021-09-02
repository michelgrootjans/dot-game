const $startIterationButton = document.getElementById('start-iteration');
const $createTaskButton = document.getElementById('create-task');

const StartIteration = event => {
  return {
    handle: () => {
      $startIterationButton.disabled = true;
      $createTaskButton.disabled = false;
      const cards = document.getElementsByClassName('card');
      while (cards.length > 0) {
        cards[0].parentNode.removeChild(cards[0]);
      }
    }
  }
};

const FinishIteration = event => {
  return {
    handle: () => {
      $startIterationButton.disabled = false;
      $createTaskButton.disabled = true;
    }
  }
};

module.exports = {StartIteration, FinishIteration}