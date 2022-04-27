const {v4: uuid} = require("uuid");

const {IterationStarted, IterationFinished} = require("../api/events/iteration");
const {TaskCreated, TaskMoved, TaskFinished, TaskRejected} = require("../api/events/task");
const {anyCardColor} = require("./Colors");

const minutes = 60 * 1000;

const Column = (state) => {
  state.numberOfAssignments = state.numberOfAssignments || 0;

  const reserve = (timeout = 5000) => {
    state.reserved = true;
    setTimeout(() => state.reserved = false, timeout)
  };

  const join = () => {
    state.numberOfAssignments++;
    state.reserved = false;
  };

  const leave = () => {
    state.numberOfAssignments--;
    state.reserved = false;
  };

  const isOpen = () => state.numberOfAssignments === 0 && !state.reserved;

  return {
    ...state,
    join,
    leave,
    isOpen,
    reserve
  }
};

const Game = state => {
  const gameId = state.gameId;
  const columns = state.columns.map(Column);

  const todoColumn = columns.find(column => column.columnType === 'todo-column');
  const workColumns = columns.filter(column => column.columnType === 'work-column');
  const testColumn = columns.find(column => column.columnType === 'test-column');
  const doneColumn = columns.find(column => column.columnType === 'done-column');
  const defectsColumn = columns.find(column => column.columnType === 'fail-column');
  const playerColumns = [todoColumn, ...workColumns, testColumn];

  const isOpen = () => playerColumns.some(c => c.isOpen());
  const join = (columnId) => findColumn(columnId).join();
  const leave = (columnId) => findColumn(columnId).leave();
  const findFreeWork = (timeout = 5000) => {
    const column = playerColumns.find(c => c.isOpen());
    if(column) column.reserve(timeout);
    return column?.columnId;
  };
  const assignments = () => playerColumns

  const findTask = taskId => state.tasks.find(t => t.taskId === taskId);
  const findColumn = columnId => columns.find(c => c.columnId === columnId);
  const inboxOf = column => {
    if(column === defectsColumn) return testColumn;
    return columns.find(c => c.nextColumnId === column.columnId);
  };
  const outboxOf = work => columns.find(c => c.columnId === work.nextColumnId);

  const currentIteration = () => state.currentIteration;
  const iterationIsRunning = () => currentIteration();
  const ids = () => ({gameId, iterationId: currentIteration().iterationId});

  const startIteration = (iterationId = uuid(), duration = 5 * minutes, publish) => {
    if(iterationIsRunning()) return;
    const startTime = Date.now();
    let iteration = {iterationId, duration, startTime};

    publish(IterationStarted({...state, ...iteration, gameId}));
    state.currentIteration = iteration;
    state.tasks = []
  };

  const endIteration = (publish) => {
    if(!iterationIsRunning()) return;
    const iteration = currentIteration();
    iteration.endTime = Date.now();
    iteration.actualDuration = iteration.endTime - iteration.startTime;

    delete state.currentIteration;
    publish(IterationFinished({...iteration, gameId}));
  }

  const createTask = (taskId, publish) => {
    if (!iterationIsRunning()) return;

    const task = {taskId, color: anyCardColor(), columnId: todoColumn.columnId, payload: {}};
    state.tasks.push(task);
    publish(TaskCreated({...task, column: todoColumn, ...ids()}))
  }

  const moveTask = (command, publish) => {
    if (!iterationIsRunning()) return;

    const task = findTask(command.taskId);
    if(command.payload) task.payload = {...task.payload, ...command.payload}
    const column = findColumn(task.columnId);

    if(!column.nextColumnId) return;

    const nextColumn = findColumn(column.nextColumnId);
    task.columnId = nextColumn.columnId;

    publish(TaskMoved({...task, from: column, to: nextColumn, ...ids()}));
    if (task.columnId === doneColumn.columnId) {
      publish(TaskFinished({...task, column: doneColumn, ...ids()}));
    }
  }

  const rejectTask = (command, publish) => {
    if (!iterationIsRunning()) return;

    const task = findTask(command.taskId);
    if(command.payload) task.payload = {...task.payload, ...command.payload}
    const column = findColumn(task.columnId);

    task.columnId = defectsColumn.columnId;

    publish(TaskMoved({...task, from: column, to: defectsColumn, ...ids()}));
    publish(TaskRejected({...task, column: defectsColumn, ...ids()}));
  }

  const findWork = (columnId) => {
    const work = findColumn(columnId);
    const inbox = inboxOf(work);
    const outbox = outboxOf(work);
    return {gameId, inbox, work, outbox, defects: defectsColumn}
  };

  return {
    ...state,
    activeColumns: columns.filter(column => ![doneColumn, defectsColumn].includes(column)),
    endColumns: [doneColumn, defectsColumn],
    playerColumns,

    isOpen,
    join,
    findFreeWork,
    leave,
    assignments,

    startIteration,
    endIteration,
    createTask,
    moveTask,
    rejectTask,
    findWork
  }
};
module.exports = Game;