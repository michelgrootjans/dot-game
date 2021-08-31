const Iteration = iteration => {

  return {

  }
}

const Game = game => {
  const todo = game.columns[0];

  const startIteration = iterationId => {
    game.iterations.push(iterationId);
    game.currentIteration = iterationId;
  }

  const endIteration = () => {
    delete game.currentIteration;
  }

  const createTask = taskId => {
    return {taskId, columnId: todo.columnId}
  }

  const moveTask = taskId => {
    if(game.currentIteration)
      return {taskId, columnId: 'c2'}
  }

  return {
    ...game,
    startIteration,
    endIteration,
    createTask,
    moveTask,
  }
}
module.exports = Game;