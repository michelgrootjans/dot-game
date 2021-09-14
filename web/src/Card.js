const createButton = (text, className, clickHandler) => {
  const button = document.createElement('button')
  button.className = className
  button.innerText = text
  button.addEventListener('click', clickHandler);
  return button;
};

const create = ({gameId, taskId, color}) => {
  const move = (gameId, taskId) => fetch(`/api/games/${gameId}/tasks/${taskId}/move`, {method: 'POST'});

  const card = document.createElement('div');
  card.className = 'card';
  card.dataset.taskId = taskId;
  card.setAttribute('style', `background: ${color};`);
  card.append(createButton('Start', 'start-button', () => move(gameId, taskId)));
  card.append(createButton('Finish', 'finish-button', () => move(gameId, taskId)));
  return card;
};

const find = ({taskId}) => document.querySelector(`[data-task-id="${taskId}"]`);

const findOrCreate = detail => {
  return find(detail) || create(detail)
}

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