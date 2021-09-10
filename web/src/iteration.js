const Graph = require("./graph");
const Timer = require("./Timer");

const $startIterationButton = document.getElementById('start-iteration');
const $createTaskButton = document.getElementById('create-task');



const clearBoard = () => {
  const cards = document.getElementsByClassName('card');
  while (cards.length > 0) {
    cards[0].parentNode.removeChild(cards[0]);
  }
};

function initProgressbar(duration) {
  const progressBar = document.getElementById("progressbar");
  progressBar.max = `${duration}`;
  Timer(duration).start(time => progressBar.value = time);
}

const graph = Graph();
function initGraph(duration) {
  if(!graph) return;
  graph.clear()
  Timer(duration).start(graph.update);
}

const StartIteration = () => {
  return {
    handle: ({duration}) => {
      if($startIterationButton) $startIterationButton.disabled = true;
      if($createTaskButton) $createTaskButton.disabled = false;
      clearBoard();
      initProgressbar(duration);
      initGraph(duration);
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