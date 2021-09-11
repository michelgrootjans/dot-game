const create = ({taskId, color}) => {
  const card = document.createElement('div');
  card.className = 'card';
  card.setAttribute('id', `task-${taskId}`)
  card.setAttribute('style', `background: ${color};`)
  return card;
};
module.exports = {create}