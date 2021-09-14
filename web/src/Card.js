const $cardTemplate = document.getElementById('card-template');

const create = ({gameId, taskId, color}) => {
  const card = $cardTemplate.content.firstElementChild.cloneNode(true);

  const move = () => fetch(`/api/games/${gameId}/tasks/${taskId}/move`, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({payload: card.payload})
  });

  card.dataset.taskId = taskId;
  card.payload = {}
  card.setAttribute('style', `background: ${color};`);
  card.querySelector('.move-button').addEventListener('click', move)
  return card;
};

const find = ({taskId}) => document.querySelector(`[data-task-id="${taskId}"]`);

const findOrCreate = detail => find(detail) || create(detail)

const remove = (detail) => {
  const card = find(detail)
  if(card) card.remove();
};

const removeAll = () => {
  const cards = document.getElementsByClassName('card');
  while (cards.length > 0) {
    cards[0].parentNode.removeChild(cards[0]);
  }
};

document.addEventListener('IterationStarted', removeAll);


module.exports = {create, find, findOrCreate, remove}