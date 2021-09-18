const API = require("./API");

const randomize = number => (Math.random() + 0.5) * number;

const PushTaskCreator = (api, batchSize) => {
  let backlog = 0;
  return () => {
    backlog++;
    while (backlog >= batchSize) {
      backlog -= batchSize;
      for (let i = 0; i < batchSize; i++) api.task.create()
    }
  }
};

const PushWorker = (api, batchSize) => (inbox, workColumn, outbox) => {
  let working = false;
  const backlog = [];
  const workspace = []

  const start = () => {
    const taskId = workspace.shift();
    api.task.move(taskId);
    return taskId;
  };

  const finish = taskId => {
    api.task.move(taskId);
    if (workspace.length > 0) work()
    else takeBatch();
  };

  function work() {
    const taskId = start();
    setTimeout(() => finish(taskId), randomize(1000 * workColumn.difficulty))
  }

  const takeBatch = () => {
    if (backlog.length < batchSize) return;

    for (let i = 0; i < batchSize; i++) workspace.push(backlog.shift())
    work()
  };

  const pushWork = taskId => {
    backlog.push(taskId);
    if(!working) takeBatch();
  };

  return {
    canWorkOn: columnId => columnId === inbox.columnId,
    pushWork
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
    timerHandle = setInterval(createTask, randomize(1000))
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
    // const timerHandle = setInterval(simulation.createTask, randomize(1000))
    document.addEventListener('IterationFinished', () => {
      // clearInterval(timerHandle);
      simulation.stop()
      document.removeEventListener('TaskCreated', simulation.onTaskCreated);
      document.removeEventListener('TaskMoved', simulation.onTaskMoved);
    });
    api.iteration.start({duration: 60000})
  };
}

module.exports = {
  initialize
};