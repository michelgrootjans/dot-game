const {IterationStarted, IterationFinished} = require("../api/events/iteration");
const {TaskCreated, TaskMoved, TaskFinished} = require("../api/events/task");
const {anyCardColor} = require("./Colors");

const Game = game => {
  const columns = game.columns;
  const todoColumn = columns[0];
  const doneColumn = columns[columns.length - 1];
  const gameId = game.gameId;

  const findTask = taskId => game.tasks.find(t => t.taskId === taskId);
  const findColumn = columnId => columns.find(c => c.columnId === columnId);

  const startIteration = (duration, publish) => {
    game.currentIteration = {duration};
    game.tasks = []
    publish(IterationStarted({...game, duration}));
  }

  const endIteration = (publish) => {
    delete game.currentIteration;
    publish(IterationFinished({gameId}));
  }

  const createTask = (taskId, publish) => {
    if (!game.currentIteration) return;

    const task = {taskId, color: anyCardColor(), columnId: todoColumn.columnId};
    game.tasks.push(task);
    publish(TaskCreated({...task, column: todoColumn, gameId}))
  }

  const moveTask = (taskId, publish) => {
    if (!game.currentIteration) return;

    const task = findTask(taskId);
    const column = findColumn(task.columnId);

    if(!column.nextColumnId) return;

    const nextColumn = findColumn(column.nextColumnId);
    task.columnId = nextColumn.columnId;

    publish(TaskMoved({...task, from: column, to: nextColumn, gameId}));
    if (task.columnId === doneColumn.columnId) {
      publish(TaskFinished({...task, gameId, column: doneColumn}));
    }
  }

  const findWork = (columnId) => {
    const work = columns.find(c => c.columnId === columnId);
    const inbox = columns.find(c => c.nextColumnId === columnId);
    const outbox = columns.find(c => c.columnId === work.nextColumnId);
    return {
      inbox,
      work,
      outbox
    }
  };

  return {
    ...game,
    startIteration,
    endIteration,
    createTask,
    moveTask,
    findWork
  }
};
module.exports = Game;