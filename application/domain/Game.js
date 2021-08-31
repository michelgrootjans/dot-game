const Game = game => {
  const columns = game.columns;
  const todo = columns[0];


  const findTask = taskId => game.tasks.find(t => t.taskId === taskId);
  const findColumn = columnId => columns.find(c => c.columnId === columnId);

  const startIteration = (duration) => {
    game.currentIteration = {duration};
    game.tasks = []
  }

  const endIteration = () => {
    delete game.currentIteration;
  }

  const createTask = taskId => {
    if (!game.currentIteration) return;

    const task = {taskId, columnId: todo.columnId};
    game.tasks.push(task);
    return task
  }

  const moveTask = taskId => {
    if (!game.currentIteration) return;

    const task = findTask(taskId);
    const column = findColumn(task.columnId)
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