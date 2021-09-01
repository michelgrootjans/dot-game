const CreateTask = ({gameId, taskId}) => ({type: 'CreateTask', gameId, taskId});
const MoveTask = ({gameId, taskId}) => ({type: 'MoveTask', gameId, taskId});

module.exports = {CreateTask, MoveTask};