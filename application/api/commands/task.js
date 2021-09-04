const CreateTask = (options) => ({...options, type: 'CreateTask'});
const MoveTask = (options) => ({...options, type: 'MoveTask'});

module.exports = {CreateTask, MoveTask};