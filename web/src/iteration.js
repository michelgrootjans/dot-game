const Graph = require("./graph");
const Timer = require("./Timer");

const clearBoard = () => {
  const cards = document.getElementsByClassName('card');
  while (cards.length > 0) {
    cards[0].parentNode.removeChild(cards[0]);
  }
};


const graph = Graph();
function initGraph(duration) {
  if(!graph) return;
  graph.clear()
  Timer(duration).start(graph.update);
}

const StartIteration = () => {
  return {
    handle: ({duration}) => {
      clearBoard();
      initGraph(duration);
    }
  }
};

module.exports = {StartIteration}