const findColumn = columnId => document.querySelector('[data-column-id="' + columnId + '"]');

const initialize = () => {
  const $playerTemplate = document.getElementById('player-template');


  document.addEventListener('PlayerJoined', ({detail}) => {
    const $column = findColumn(detail.columnId);
    const $newPlayer = $playerTemplate.content.firstElementChild.cloneNode(true)

    $column.querySelector('.participants').append($newPlayer)
  });

  document.addEventListener('PlayerLeft', ({detail}) => {
    const $column = findColumn(detail.columnId);

    $column.querySelector('.participants').firstElementChild.remove();
  });

}

module.exports = {initialize};