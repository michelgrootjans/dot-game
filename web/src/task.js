const move = (gameId, taskId) => fetch(`/api/games/${gameId}/tasks/${taskId}/move`, {method: 'POST'});
const getColumn = id => document.getElementById("column-" + id);
const getCard = id => document.getElementById("task-" + id);

const any = array => array[Math.floor(Math.random() * array.length)]
const cardColors = ['#FF7EB9', '#FF65A3', '#7AFCFF', '#FEFF9C', '#FFF740'] // from https://www.color-hex.com/color-palette/29241

const createCard = taskId => {
  const card = document.createElement('div');
  card.className = 'card';
  card.setAttribute('id', `task-${taskId}`)
  card.setAttribute('style', 'background:' + any(cardColors))
  card.setAttribute('background', any(cardColors))
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