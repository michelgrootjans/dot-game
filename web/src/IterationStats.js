const td = ({id, text}) => {
  const element = document.createElement('td');
  element.dataset.iterationId = id;
  if(text) element.textContent = text;
  return element;
};

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
  const $container = document.getElementById('iterations-container');

  const $template = document.getElementById('iteration-stats-template');
  if (!($container && $template)) return;

  const $stats = $template.content.firstElementChild.cloneNode(true);
  $container.innerHTML = '';

  $container.append($stats)
  const iterations = []

  let currentIteration = undefined;

  const renderIteration = () => {
    $container.querySelector('.iteration-name').append(td({id: currentIteration.iterationId, text: currentIteration.iterationId}))
    $container.querySelector('.total').append(td({id: currentIteration.iterationId}))
    $container.querySelector('.defects').append(td({id: currentIteration.iterationId}))
    $container.querySelector('.success').append(td({id: currentIteration.iterationId}))
    $container.querySelector('.wip').append(td({id: currentIteration.iterationId}))
    $container.querySelector('.throughput').append(td({id: currentIteration.iterationId}))
    $container.querySelector('.lead-time').append(td({id: currentIteration.iterationId}))
  };

  const updateIteration = (detail) => {
    $container.querySelector(`.total [data-iteration-id="${currentIteration.iterationId}"]`).textContent = currentIteration.total();
    $container.querySelector(`.defects [data-iteration-id="${currentIteration.iterationId}"]`).textContent = currentIteration.defects();
    $container.querySelector(`.success [data-iteration-id="${currentIteration.iterationId}"]`).textContent = currentIteration.success();
    $container.querySelector(`.wip [data-iteration-id="${currentIteration.iterationId}"]`).textContent = currentIteration.wip();
    $container.querySelector(`.throughput [data-iteration-id="${currentIteration.iterationId}"]`).textContent = round(currentIteration.throughput(detail.timestamp), 2);
    $container.querySelector(`.lead-time [data-iteration-id="${currentIteration.iterationId}"]`).textContent = round(currentIteration.leadTime(detail.timestamp), 2);
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
