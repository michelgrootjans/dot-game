const move = (gameId, taskId) => fetch(`/api/games/${gameId}/tasks/${taskId}/move`, {method: 'POST'});
const getColumn = id => document.getElementById("column-" + id).querySelector(".tasks");
const getCard = id => document.getElementById("task-" + id);

const createCard = (taskId, color) => {
  const card = document.createElement('div');
  card.className = 'card';
  card.setAttribute('id', `task-${taskId}`)
  card.setAttribute('style', `background: ${color};`)
  return card;
};

const TaskCreated = event => {
  return {
    handle: ({gameId, columnId, taskId, color}) => {
      const card = createCard(taskId, color);
      getColumn(columnId).append(card);
      card.addEventListener('click', () => move(gameId, taskId))
    }
  }
};

const TaskMoved = event => {
  return {
    handle: ({columnId, taskId}) => {
      const card = getCard(taskId);
      const column = getColumn(columnId);

      if(card && column) column.append(card);
    }
  }
};

module.exports = {TaskCreated, TaskMoved}