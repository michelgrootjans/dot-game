const fourPlayers = require('./initial-4-player-state')
const fivePlayers = require('./initial-5-player-state')
const {DEFAULT_TASK_NAMES} = require("./defaults");

const toId = (name) => name.split(' ').join('')
const toTasks = names => names.map(name => ({title: name, id: toId(name)}));

const initialState = ({numberOfPlayers, taskNames} = {numberOfPlayers: 5, taskNames: DEFAULT_TASK_NAMES}) => {
  console.log({taskNames})
  if (taskNames.length === 4) {
    return fourPlayers(toTasks(taskNames))
  } else {
    return fivePlayers(toTasks(taskNames))
  }
}

module.exports = initialState
