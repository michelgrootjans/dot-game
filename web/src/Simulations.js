const API = require("./API");

const randomize = number => (Math.random() + 0.5) * number;

const PushTaskCreator = (api, batchSize) => () => api.task.create();

const PushWorker = (api, batchSize) => {
  return (inbox, workColumn, outbox) => {
    const backlog = [];
    const workspace = []
    const working = () => workspace.length > 0;
    const amountOfWork = 1000 * (workColumn.difficulty || 1);

    let workingOnTask = false;
    const start = () => {
      if(workingOnTask) return;
      workingOnTask = true;
      const taskId = workspace.shift();
      const effort = randomize(amountOfWork);
      setTimeout(() => finish(taskId), effort)
    };

    const finish = taskId => {
      api.task.move(taskId);
      workingOnTask = false;
      if (working()) start()
      else takeBatch();
    };

    const takeBatch = () => {
      if (working()) return;
      if (backlog.length < batchSize) return;

      for (let i = 0; i < batchSize; i++) {
        const taskId = backlog.shift();
        workspace.push(taskId);
        api.task.move(taskId);
      }
      start()
    };

    const pushWork = taskId => {
      backlog.push(taskId);
      takeBatch();
    };

    return {
      canWorkOn: columnId => columnId === inbox.columnId,
      pushWork
    };
  };
};

const Simulation = (createTask, createWorker) => {
  let workers = []
  let timerHandle = undefined;

  const start = ({detail}) => {
    const columns = detail.columns;

    const workColumns = columns.filter(c => ['work-column', 'test-column'].includes(c.columnType));
    const inboxFor = column => columns.find(c => c.nextColumnId === column.columnId);
    const outboxFor = column => columns.find(c => column.nextColumnId === c.columnId);

    workers = workColumns.map(column => createWorker(inboxFor(column), column, outboxFor(column)))
    timerHandle = setInterval(createTask, 500)
  };

  const onTaskCreated = ({detail}) => {
    const worker = workers.find(worker => worker.canWorkOn(detail.columnId));
    worker?.pushWork(detail.taskId)
  };

  const onTaskMoved = ({detail}) => {
    const worker = workers.find(worker => worker.canWorkOn(detail.to.columnId));
    worker?.pushWork(detail.taskId)
  };

  const stop = () => {
    clearInterval(timerHandle);
  }

  return {
    start,
    onTaskCreated,
    onTaskMoved,
    stop
  };
};


const initialize = (gameId) => {
  const api = API(gameId)

  function createSimulation(strategy, batchSize) {
    if (strategy === 'pull') {
      return Simulation(PushTaskCreator(api, batchSize), PushWorker(api, batchSize));
    }
    return Simulation(PushTaskCreator(api, batchSize), PushWorker(api, batchSize));
  }

  window.runSimulation = (strategy = 'push', batchSize = 5) => {
    const simulation = createSimulation(strategy, batchSize);
    document.addEventListener('IterationStarted', simulation.start, {once: true});
    document.addEventListener('TaskCreated', simulation.onTaskCreated);
    document.addEventListener('TaskMoved', simulation.onTaskMoved);
    document.addEventListener('IterationFinished', () => {
      simulation.stop()
      document.removeEventListener('TaskCreated', simulation.onTaskCreated);
      document.removeEventListener('TaskMoved', simulation.onTaskMoved);
    }, {once: true});
    api.iteration.start({duration: 5 * 60 * 1000})
  };
}

module.exports = {
  initialize
};