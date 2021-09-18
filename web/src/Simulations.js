const API = require("./API");

const randomize = number => (Math.random() + 0.5) * number;

let taskCounter = 1;
const PushTaskCreator = (api, batchSize) => () => api.task.create();

const PushWorker = (api, batchSize) => {
  let working = false;
  const backlog = [];
  const workspace = []

  return (inbox, workColumn, outbox) => {
    const amountOfWork = 1000 * (workColumn.difficulty || 1);

    const start = () => {
      const taskId = workspace.shift();
      setTimeout(() => finish(taskId), randomize(amountOfWork))
    };

    const finish = taskId => {
      api.task.move(taskId);
      if (workspace.length > 0) start()
      else takeBatch();
    };

    const takeBatch = () => {
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
      if (!working) takeBatch();
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
    // timerHandle = setInterval(createTask, 1000)
  };

  const onTaskCreated = ({detail}) => {
    const worker = workers.find(worker => worker.canWorkOn(detail.columnId));
    worker?.pushWork(detail.taskId)
  };

  const onTaskMoved = ({detail}) => {
    const worker = workers.find(worker => worker.canWorkOn(detail.to.columnId));
    worker?.pushWork(detail.taskId)
  };

  const stop = () => clearInterval(timerHandle)

  return {
    start,
    onTaskCreated,
    onTaskMoved,
    stop
  };
};


const initialize = (gameId) => {
  const api = API(gameId)

  window.runSimulation = (param) => {
    const simulation = Simulation(PushTaskCreator(api, 5), PushWorker(api, 5));
    document.addEventListener('IterationStarted', simulation.start);
    document.addEventListener('TaskCreated', simulation.onTaskCreated);
    document.addEventListener('TaskMoved', simulation.onTaskMoved);
    document.addEventListener('IterationFinished', () => {
      simulation.stop()
      document.removeEventListener('TaskCreated', simulation.onTaskCreated);
      document.removeEventListener('TaskMoved', simulation.onTaskMoved);
    });
    api.iteration.start({duration: 10 * 60 * 1000})
  };
}

module.exports = {
  initialize
};