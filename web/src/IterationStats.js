const round = (number, decimalPlaces) => {
  const factorOfTen = Math.pow(10, decimalPlaces);
  return Math.round(number * factorOfTen) / factorOfTen;
};

const Task = task => {
  const taskId = task.taskId;
  let endTime = undefined;

  const finishAt = timestamp => endTime = timestamp;
  const done = () => endTime !== undefined

  return {
    taskId,
    done,
    inProgress: () => !done(),
    finishAt,
  };
};

const IterationStats = (iterationId, details) => {
  const startTime = details.timestamp;
  const tasks = [];

  const startTask = (details) => tasks.push(Task(details));
  const finishTask = (details) => tasks.find(t => t.taskId === details.taskId).finishAt(details.timestamp);

  const finishIteration = (details) => {}
  const tasksDone = () => tasks.filter(t => t.done());
  const tasksInProgress = () => tasks.filter(t => t.inProgress());

  const wip = () => tasksInProgress().length;
  const success = () => tasksDone().length;

  const throughput = (now) => 60 * 1000 * success() / (now - startTime);
  const leadTime = (now) => wip() / throughput(now);

  return {
    iterationId,
    total: success,
    defects: () => 0,
    success,
    wip,
    throughput,
    leadTime,
    startTask,
    finishTask,
    finishIteration,
  };
};

const initialize = () => {
  const $container = document.getElementById('iterations-stats-container');

  const $template = document.getElementById('iteration-stats-template');
  if (!($container && $template)) return;

  const iterations = []
  let currentIteration = undefined;
  let $currentIteration = undefined;

  const renderIteration = () => {
    $currentIteration = $template.content.firstElementChild.cloneNode(true);
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

  document.addEventListener('IterationStarted', ({detail}) => {
    currentIteration = IterationStats(iterations.length + 1, detail)
    iterations.push(currentIteration);
    renderIteration();
  });
  document.addEventListener('TaskCreated', ({detail}) => {
    currentIteration.startTask(detail)
    updateIteration(detail);
  });
  document.addEventListener('TaskFinished', ({detail}) => {
    currentIteration.finishTask(detail)
    updateIteration(detail);
  });
  document.addEventListener('IterationFinished', ({detail}) => {
    currentIteration.finishIteration(detail)
    updateIteration(detail);
  });
}

module.exports = {
  initialize
};
