const fourPlayers = require('./initial-4-player-state')
const fivePlayers = require('./initial-5-player-state')

const toId = (name) => name.split(' ').join('')
const toTasks = names => names.map(name => ({name, id: toId(name)}));

const initialState = (numberOfPlayers = 5) => {
  if (numberOfPlayers === 4 || numberOfPlayers === '4') {
    return fourPlayers()
  } else {
    const taskNames = ['To Do', 'Analysis', 'Development', 'Ops', 'QA']
    return fivePlayers(toTasks(taskNames))
  }
}

module.exports = initialState
