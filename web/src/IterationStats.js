const round = (number, decimalPlaces) => {
  const factorOfTen = Math.pow(10, decimalPlaces);
  return Math.round(number * factorOfTen) / factorOfTen;
};

const Task = task => {
  const taskId = task.taskId;
  let state = 'in-progress';

  const finish = () => state = 'done';
  const reject = () => state = 'rejected';

  return {
    taskId,
    done: () => state === 'done',
    rejected: () => state === 'rejected',
    inProgress: () => state === 'in-progress',
    finish,
    reject
  };
};

const IterationStats = (iterationId, details) => {
  const startTime = details.timestamp;
  const tasks = [];

  const startTask = (details) => tasks.push(Task(details));
  const finishTask = (details) => tasks.find(t => t.taskId === details.taskId).finish();
  const rejectTask = (details) => tasks.find(t => t.taskId === details.taskId).reject();

  const finishIteration = (details) => {}
  const tasksDone = () => tasks.filter(t => t.done());
  const tasksRejected = () => tasks.filter(t => t.rejected());
  const tasksInProgress = () => tasks.filter(t => t.inProgress());

  const wip = () => tasksInProgress().length;
  const defects = () => tasksRejected().length;
  const success = () => tasksDone().length;
  const total = () => success() + defects();

  const throughput = (now) => 60 * 1000 * success() / (now - startTime);
  const leadTime = (now) => wip() / throughput(now);

  return {
    iterationId,
    defects,
    success,
    total,
    wip,
    throughput,
    leadTime,
    startTask,
    finishTask,
    rejectTask,
    finishIteration,
  };
};

const initialize = (gameId, subscribe) => {
  const $container = document.getElementById('iterations-stats-container');

  const $template = document.getElementById('iteration-stats-template');
  if (!($container && $template)) return;

  const iterations = []
  let currentIteration = undefined;
  let $currentIteration = undefined;

  const renderIteration = (detail) => {
    $currentIteration = $template.content.firstElementChild.cloneNode(true);
    $currentIteration.dataset.iterationId = detail.iterationId;
    $currentIteration.querySelector('.iteration-name').innerText = currentIteration.iterationId;
    $container.append($currentIteration);
  };

  const updateIteration = (detail) => {
    $currentIteration.querySelector(`.total`).textContent = currentIteration.total();
    $currentIteration.querySelector(`.defects`).textContent = currentIteration.defects();
    $currentIteration.querySelector(`.success`).textContent = currentIteration.success();
    $currentIteration.querySelector(`.wip`).textContent = currentIteration.wip();
    $currentIteration.querySelector(`.throughput`).textContent = round(currentIteration.throughput(detail.timestamp), 2);
    $currentIteration.querySelector(`.lead-time`).textContent = round(currentIteration.leadTime(detail.timestamp), 2);
  };

  subscribe('IterationStarted', (event) => {
    currentIteration = IterationStats(iterations.length + 1, event)
    iterations.push(currentIteration);
    renderIteration(event);
  });
  subscribe('TaskCreated', (event) => {
    currentIteration.startTask(event)
    updateIteration(event);
  });
  subscribe('TaskFinished', (event) => {
    currentIteration.finishTask(event)
    updateIteration(event);
  });
  subscribe('TaskRejected', (event) => {
    currentIteration.rejectTask(event)
    updateIteration(event);
  });
  subscribe('IterationFinished', (event) => {
    currentIteration.finishIteration(event)
    updateIteration(event);
  });
}

module.exports = {
  initialize
};
