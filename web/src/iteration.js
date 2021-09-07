const Graph = require("./graph");

const $startIterationButton = document.getElementById('start-iteration');
const $createTaskButton = document.getElementById('create-task');

const Timer = (duration, progressBar) => {
  const startTime = new Date();
  progressBar.max = `${duration}`;

  return {
    start: () => {
      const graph = Graph();
      const timer = setInterval(async () => {
        const timeleft = new Date() - startTime;
        await graph.update();
        if (duration <= timeleft) clearInterval(timer);
        progressBar.value = timeleft;
      }, 1000);

    }
  }
};

const clearBoard = () => {
  const cards = document.getElementsByClassName('card');
  while (cards.length > 0) {
    cards[0].parentNode.removeChild(cards[0]);
  }
};

const StartIteration = event => {
  return {
    handle: ({duration}) => {
      $startIterationButton.disabled = true;
      $createTaskButton.disabled = false;
      clearBoard();
      Timer(duration, document.getElementById("progressbar")).start();
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