const fourPlayers = require('./initial-4-player-state')
const fivePlayers = require('./initial-5-player-state')
const {DEFAULT_TASK_NAMES} = require("./defaults");

const toId = (name) => name.split(' ').join('')
const toTasks = names => names.map(name => ({title: name, id: toId(name)}));

const initialState = ({numberOfPlayers} = {numberOfPlayers: 5}) => {
  const taskNames = ['To Do', 'Analysis', 'Development', 'QA']
  if (numberOfPlayers === 4 || numberOfPlayers === '4') {
    return fourPlayers(toTasks(taskNames))
  } else {
    return fivePlayers(toTasks(DEFAULT_TASK_NAMES))
  }
}

module.exports = initialState
