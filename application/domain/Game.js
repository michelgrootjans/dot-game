const {IterationStarted, IterationFinished} = require("../api/events/iteration");
const {TaskCreated, TaskMoved, TaskFinished, TaskRejected} = require("../api/events/task");
const {anyCardColor} = require("./Colors");

const minutes = 60 * 1000;

const Game = game => {
  const gameId = game.gameId;
  const columns = game.columns;
  const todoColumn = columns.find(column => column.columnType === 'start-column');
  const doneColumn = columns.find(column => column.columnType === 'done-column');
  const defectsColumn = columns.find(column => column.columnType === 'defect-column');

  const findTask = taskId => game.tasks.find(t => t.taskId === taskId);
  const findColumn = columnId => columns.find(c => c.columnId === columnId);

  const iterationIsRunning = () => game.currentIteration;

  const startIteration = (duration = 5 * minutes, publish) => {
    if(iterationIsRunning()) return;

    const startTime = Date.now();
    game.currentIteration = {duration, startTime};
    game.tasks = []
    publish(IterationStarted({...game, duration, startTime}));
  };

  const endIteration = (publish) => {
    if(!iterationIsRunning()) return;

    delete game.currentIteration;
    publish(IterationFinished({gameId}));
  }

  const createTask = (taskId, publish) => {
    if (!iterationIsRunning()) return;

    const task = {taskId, color: anyCardColor(), columnId: todoColumn.columnId, payload: {}};
    game.tasks.push(task);
    publish(TaskCreated({...task, column: todoColumn, gameId}))
  }

  const moveTask = (command, publish) => {
    if (!iterationIsRunning()) return;

    const task = findTask(command.taskId);
    if(command.payload) task.payload = {...task.payload, ...command.payload}
    const column = findColumn(task.columnId);

    if(!column.nextColumnId) return;

    const nextColumn = findColumn(column.nextColumnId);
    task.columnId = nextColumn.columnId;

    publish(TaskMoved({...task, from: column, to: nextColumn, gameId}));
    if (task.columnId === doneColumn.columnId) {
      publish(TaskFinished({...task, gameId, column: doneColumn}));
    }
  }

  const rejectTask = (command, publish) => {
    if (!iterationIsRunning()) return;

    const task = findTask(command.taskId);
    if(command.payload) task.payload = {...task.payload, ...command.payload}
    const column = findColumn(task.columnId);

    task.columnId = defectsColumn.columnId;

    publish(TaskMoved({...task, from: column, to: defectsColumn, gameId}));
    publish(TaskRejected({...task, column: defectsColumn, gameId}));
  }

  const findWork = (columnId) => {
    const work = columns.find(c => c.columnId === columnId);
    const inbox = columns.find(c => c.nextColumnId === columnId);
    const outbox = columns.find(c => c.columnId === work.nextColumnId);
    return {gameId, inbox, work, outbox, defects: defectsColumn}
  };

  return {
    ...game,
    activeColumns: columns.filter(column => ![doneColumn, defectsColumn].includes(column)),
    endColumns: [doneColumn, defectsColumn],
    startIteration,
    endIteration,
    createTask,
    moveTask,
    rejectTask,
    findWork
  }
};
module.exports = Game;