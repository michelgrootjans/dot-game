const $cardTemplate = document.getElementById('card-template');

const execute = (action, gameId, taskId, payload) => {
  return fetch(`/api/games/${gameId}/tasks/${taskId}/${action}`, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({payload})
  });
};

const create = ({gameId, taskId, color}) => {
  const card = $cardTemplate.content.firstElementChild.cloneNode(true);

  const move = (event) => {
    event.preventDefault()
    execute('move', gameId, taskId, card.payload);
  };

  const reject = (event) => {
    event.preventDefault()
    execute('reject', gameId, taskId, card.payload);
  };

  card.dataset.taskId = taskId;
  card.payload = {}
  card.setAttribute('style', `background: ${color};`);
  card.querySelector('.move-button').addEventListener('click', move)
  card.querySelector('.reject-button').addEventListener('click', reject)
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