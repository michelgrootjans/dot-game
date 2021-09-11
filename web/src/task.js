const move = ({gameId, taskId}) => fetch(`/api/games/${gameId}/tasks/${taskId}/move`, {method: 'POST'});
const getColumn = ({columnId}) => document.getElementById("column-" + columnId)?.querySelector(".tasks");
const getCard = ({taskId}) => document.getElementById("task-" + taskId);

const createCard = ({taskId, color}) => {
  const card = document.createElement('div');
  card.className = 'card';
  card.setAttribute('id', `task-${taskId}`)
  card.setAttribute('style', `background: ${color};`)
  return card;
};

const TaskCreated = () => {
  return {
    handle: (event) => {
      const column = getColumn(event.column);
      if(!column) return;
      const card = createCard(event);
      column.append(card);
      card.addEventListener('click', () => move(event))
    }
  }
};

const TaskMoved = () => {
  return {
    handle: (event) => {
      const card = getCard(event);
      const column = getColumn(event.to);
      
      if (column) {
        column.append(card || createCard(event));
      } else {
        if(card) card.remove()
      }
    }
  }
};

module.exports = {TaskCreated, TaskMoved}