const td = ({iterationId, text}) => {
  const element = document.createElement('td');
  element.textContent = text;
  element.dataset.iterationId = iterationId;
  return element;
};

const initialize = gameId => {
  $container = document.getElementById('iterations-container');
  $template = document.getElementById('iteration-stats-template');

  if (!($container && $template)) return;

  const $stats = $template.content.firstElementChild.cloneNode(true);
  $container.innerHTML = '';
  $container.append($stats)

  const iterations = []
  let currentIteration = undefined;

  const createIteration = () => {
    const id = iterations.length + 1;

    return {id, wip: 0};
  };

  const renderIteration = (iteration) => {
    $container.querySelector('.iteration-name').append(td({iterationId: iteration.id, text: iteration.id}))
    $container.querySelector('.total').append(td({iterationId: iteration.id, text: 0}))
    $container.querySelector('.defects').append(td({iterationId: iteration.id, text: 0}))
    $container.querySelector('.success').append(td({iterationId: iteration.id, text: 0}))
    $container.querySelector('.wip').append(td({iterationId: iteration.id, text: 0}))
    $container.querySelector('.throughput').append(td({iterationId: iteration.id, text: '-'}))
    $container.querySelector('.lead-time').append(td({iterationId: iteration.id, text: '-'}))
    updateIteration();
  };

  const updateIteration = (iteration) => {
    $container.querySelector(`.wip [data-iteration-id="${iteration.id}"]`).textContent = iteration.wip;
  };

  document.addEventListener('IterationStarted', ({detail}) => {
    currentIteration = createIteration()
    iterations.push(currentIteration);
    renderIteration(currentIteration);
  });
  document.addEventListener('TaskCreated', ({detail}) => {
    currentIteration.wip++;
    updateIteration(currentIteration);
  });
  document.addEventListener('TaskFinished', ({detail}) => {
    currentIteration.wip--;
    updateIteration(currentIteration);
  });

}

module.exports = {
  initialize
};
