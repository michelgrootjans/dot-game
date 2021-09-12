const create = ({gameId, taskId, color}) => {
  const move = (gameId, taskId) => fetch(`/api/games/${gameId}/tasks/${taskId}/move`, {method: 'POST'});

  const card = document.createElement('div');
  card.className = 'card';
  card.setAttribute('id', `task-${taskId}`)
  card.setAttribute('style', `background: ${color};`);
  card.addEventListener('click', () => move(gameId, taskId));
  return card;
};

const getCard = ({taskId}) => document.getElementById("task-" + taskId);

const findOrCreate = detail => {
  return getCard(detail) || create(detail)
}

const remove = (detail) => {
  const card = getCard(detail)
  if(card) card.remove();
};
module.exports = {create, findOrCreate, remove}