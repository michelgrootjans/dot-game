const TaskCreated = (options) => ({...options, type: 'TaskCreated'})
const TaskMoved = (options) => ({...options, type: 'TaskMoved'})
const TaskFinished = (options) => ({...options, type: 'TaskFinished'})

module.exports = {TaskCreated, TaskMoved, TaskFinished}