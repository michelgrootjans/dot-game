const {anyCardColor} = require("./CardColors");
const move = (gameId, taskId) => fetch(`/api/games/${gameId}/tasks/${taskId}/move`, {method: 'POST'});
const getColumn = id => document.getElementById("column-" + id);
const getCard = id => document.getElementById("task-" + id);


const createCard = taskId => {
  const card = document.createElement('div');
  card.className = 'card';
  card.setAttribute('id', `task-${taskId}`)
  card.setAttribute('style', 'background:' + anyCardColor())
  return card;
};

const TaskCreated = event => {
  return {
    handle: ({gameId, columnId, taskId}) => {
      const card = createCard(taskId);
      getColumn(columnId).append(card);
      card.addEventListener('click', () => move(gameId, taskId))
    }
  }
};

const TaskMoved = event => {
  return {
    handle: ({to, taskId}) => {
      const card = getCard(taskId);
      const column = getColumn(to);

      if(card && column) column.append(card);
    }
  }
};

module.exports = {TaskCreated, TaskMoved}