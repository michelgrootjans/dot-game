const move = (gameId, taskId) => fetch(`/api/games/${gameId}/tasks/${taskId}/move`, {method: 'POST'});

const createCard = taskId => {
  const card = document.createElement('div');
  card.className = 'card';
  card.setAttribute('id', `task-${taskId}`)
  return card;
};

const TaskCreated = event => {
  return {
    handle: ({gameId, columnId, taskId}) => {
      const card = createCard(taskId);
      document.getElementById("column-" + columnId).append(card);
      card.addEventListener('click', () => move(gameId, taskId))
    }
  }
};

const TaskMoved = event => {
  return {
    handle: ({to, taskId}) => {
      const card = document.getElementById("task-" + taskId);
      const column = document.getElementById("column-" + to);

      column.append(card);
    }
  }
};

module.exports = {TaskCreated, TaskMoved}