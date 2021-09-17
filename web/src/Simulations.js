const API = require("./API");

const initialize = (gameId) => {
  const api = API(gameId)
  let iteration = undefined;

  const createTask = () => {
    console.log('PING')
  };
  const onTaskCreated = ({detail}) => {
  };
  const onTaskMoved = ({detail}) => {
  };
  const onTaskFinished = ({detail}) => {
  };

  window.runSimulation = (param) => {
    let timerHandle = undefined;
    document.addEventListener('IterationStarted', ({detail}) => {
      console.log('START')
      iteration = detail;
      timerHandle = setInterval(createTask, 1000)
      document.addEventListener('TaskCreated', onTaskCreated);
      document.addEventListener('TaskMoved', onTaskMoved);
      document.addEventListener('TaskFinished', onTaskFinished);
    });
    document.addEventListener('IterationFinished', () => {
      console.log('FINISH')
      clearInterval(timerHandle);
      document.removeEventListener('TaskCreated', onTaskCreated);
      document.removeEventListener('TaskMoved', onTaskMoved);
      document.removeEventListener('TaskFinished', onTaskFinished);
    });
    api.iteration.start({duration: 60000})
  };

}

module.exports = {
  initialize
};