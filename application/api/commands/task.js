const CreateTask = (options) => ({...options, type: 'CreateTask'});
const MoveTask = (options) => ({...options, type: 'MoveTask'});
const RejectTask = (options) => ({...options, type: 'RejectTask'});

module.exports = {CreateTask, MoveTask, RejectTask};