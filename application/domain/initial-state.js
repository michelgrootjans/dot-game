const fourPlayers = require('./initial-4-player-state')
const fivePlayers = require('./initial-5-player-state')
const {DEFAULT_TASK_NAMES} = require("./defaults");

const toId = (name) => name.split(' ').join('')
const toTasks = names => names.map(name => ({title: name, id: toId(name)}));

const initialState = ({taskNames = []} = {taskNames: DEFAULT_TASK_NAMES}) => {
  if (taskNames.length === 4) {
    return fourPlayers(toTasks(taskNames))
  } else if(taskNames.length === 5) {
    return fivePlayers(toTasks(taskNames))
  }
  throw 'Invalid parameters: task names'
}

module.exports = initialState
