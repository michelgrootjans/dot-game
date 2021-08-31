const Game = game => {
  const columns = game.columns;
  const todo = columns[0];

  game.tasks = game.tasks || []
  const tasks = game.tasks

  const startIteration = (duration) => {
    game.currentIteration = {duration};
  }

  const endIteration = () => {
    delete game.currentIteration;
  }

  const createTask = taskId => {
    if (!game.currentIteration) return;

    const task = {taskId, columnId: todo.columnId};
    tasks.push(task);
    return task
  }

  const moveTask = taskId => {
    if (!game.currentIteration) return;

    const task = tasks.find(t => t.taskId === taskId);
    const column = columns.find(c => c.columnId === task.columnId)
    task.columnId = column.nextColumnId;

    return task
  }

  return {
    ...game,
    startIteration,
    endIteration,
    createTask,
    moveTask,
  }
};
module.exports = Game;