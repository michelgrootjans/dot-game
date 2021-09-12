const Graph = require("./graph");
const Timer = require("./Timer");

const graph = Graph();
function initGraph(duration) {
  if(!graph) return;
  graph.clear()
  Timer(duration).start(graph.update);
}

const StartIteration = () => {
  return {
    handle: ({duration}) => {
      initGraph(duration);
    }
  }
};

module.exports = {StartIteration}