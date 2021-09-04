const $startIterationButton = document.getElementById('start-iteration');
const $createTaskButton = document.getElementById('create-task');

const Timer = (duration) => {
  const startTime = new Date();
  const progressBar = document.getElementById("progressbar");
  progressBar.max = `${duration}`;

  return {
    start: () => {
      const downloadTimer = setInterval(function () {
        const timeleft = new Date() - startTime;
        if (duration <= timeleft) clearInterval(downloadTimer);
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
      Timer(duration).start();
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