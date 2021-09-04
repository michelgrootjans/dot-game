const {IterationStarted, IterationFinished} = require("../api/events/iteration");
const {TaskCreated, TaskMoved, TaskFinished} = require("../api/events/task");

const Game = game => {
  const columns = game.columns;
  const todo = columns[0];


  const findTask = taskId => game.tasks.find(t => t.taskId === taskId);
  const findColumn = columnId => columns.find(c => c.columnId === columnId);

  const startIteration = (duration, publish) => {
    game.currentIteration = {duration};
    game.tasks = []
    publish(IterationStarted({...game, duration}));
  }

  const endIteration = (publish) => {
    delete game.currentIteration;
    publish(IterationFinished(game.gameId));
  }

  const createTask = (taskId, publish) => {
    if (!game.currentIteration) return;

    const task = {taskId, columnId: todo.columnId};
    game.tasks.push(task);
    publish(TaskCreated({...task, gameId: game.gameId}))
  }

  const moveTask = (taskId, publish) => {
    if (!game.currentIteration) return;

    const task = findTask(taskId);
    const column = findColumn(task.columnId)
    task.columnId = column.nextColumnId;

    publish(TaskMoved({...task, gameId: game.gameId}));
    if (task.columnId === 'c9') {
      publish(TaskFinished({...task, gameId: game.gameId}));
    }
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