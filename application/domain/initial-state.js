const fourSteps = require('./initial-4-step-state')
const defaultState = require('./initial-5-step-state')


const initialState = (numberOfPlayers = 5) => {
    if (numberOfPlayers === 4 || numberOfPlayers === "4")
        return fourSteps()
    else
        return defaultState()
}

module.exports = initialState;
