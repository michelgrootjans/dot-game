const td = ({iterationId, text}) => {
  const element = document.createElement('td');
  element.textContent = text;
  element.dataset.iterationId = iterationId;
  return element;
};

const round = (number, decimalPlaces) => {
  const factorOfTen = Math.pow(10, decimalPlaces);
  return Math.round(number * factorOfTen) / factorOfTen;
};

const IterationStats = (iterationId) => {
  const startTime = Date.now();
  const tasks = [];

  const startTask = (task) => tasks.push({taskId: task.taskId, finished: false, startTime: Date.now()});
  const finishTask = (task) => {
    const taskToFinish = tasks.find(t => t.taskId === task.taskId);
    taskToFinish.finished = true;
    taskToFinish.endTime = Date.now();
    taskToFinish.duration = taskToFinish.endTime - taskToFinish.startTime;
    console.log({task, taskToFinish})
  };
  const tasksFinished = () => tasks.filter(task => task.finished);
  const tasksInProgress = () => tasks.filter(task => !task.finished);

  const wip = () => tasksInProgress().length;
  const success = () => tasksFinished().length;

  const throughput = () => {

    return 60 * 1000 * success() / (Date.now() - startTime);
  };
  const leadTime = () => wip() / throughput();

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
  };
};

const initialize = gameId => {
  const $container = document.getElementById('iterations-container');

  const $template = document.getElementById('iteration-stats-template');
  if (!($container && $template)) return;

  const $stats = $template.content.firstElementChild.cloneNode(true);
  $container.innerHTML = '';

  $container.append($stats)
  const iterations = []

  let currentIteration = undefined;

  const renderIteration = () => {
    $container.querySelector('.iteration-name').append(td({iterationId: currentIteration.iterationId, text: currentIteration.iterationId}))
    $container.querySelector('.total').append(td({iterationId: currentIteration.iterationId, text: 0}))
    $container.querySelector('.defects').append(td({iterationId: currentIteration.iterationId, text: 0}))
    $container.querySelector('.success').append(td({iterationId: currentIteration.iterationId, text: 0}))
    $container.querySelector('.wip').append(td({iterationId: currentIteration.iterationId, text: currentIteration.wip()}))
    $container.querySelector('.throughput').append(td({iterationId: currentIteration.iterationId, text: '-'}))
    $container.querySelector('.lead-time').append(td({iterationId: currentIteration.iterationId, text: '-'}))
    updateIteration();
  };

  const updateIteration = () => {
    $container.querySelector(`.total [data-iteration-id="${currentIteration.iterationId}"]`).textContent = currentIteration.total();
    $container.querySelector(`.defects [data-iteration-id="${currentIteration.iterationId}"]`).textContent = currentIteration.defects();
    $container.querySelector(`.success [data-iteration-id="${currentIteration.iterationId}"]`).textContent = currentIteration.success();
    $container.querySelector(`.wip [data-iteration-id="${currentIteration.iterationId}"]`).textContent = currentIteration.wip();
    $container.querySelector(`.throughput [data-iteration-id="${currentIteration.iterationId}"]`).textContent = round(currentIteration.throughput(), 2);
    $container.querySelector(`.lead-time [data-iteration-id="${currentIteration.iterationId}"]`).textContent = round(currentIteration.leadTime(), 2);
  };

  document.addEventListener('IterationStarted', ({detail}) => {
    currentIteration = IterationStats(iterations.length + 1)
    iterations.push(currentIteration);
    renderIteration();
  });
  document.addEventListener('TaskCreated', ({detail}) => {
    currentIteration.startTask(detail)
    updateIteration();
  });
  document.addEventListener('TaskFinished', ({detail}) => {
    currentIteration.finishTask(detail)
    updateIteration();
  });
  document.addEventListener('IterationFinished', updateIteration);
}

module.exports = {
  initialize
};
