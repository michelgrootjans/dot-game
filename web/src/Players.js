const findColumn = (columnId) => document.querySelector('[data-column-id="' + columnId + '"]')

const initialize = () => {
  const $playerTemplate = document.getElementById('player-template')
  if (!$playerTemplate) return

  document.addEventListener('PlayerJoined', ({ detail }) => {
    const $column = findColumn(detail.columnId)
    if (!$column) return
    const $newPlayer = $playerTemplate.content.firstElementChild.cloneNode(true)

    $column.querySelector('.participants').append($newPlayer)
  })

  document.addEventListener('PlayerLeft', ({ detail }) => {
    const $column = findColumn(detail.columnId)
    if (!$column) return

    $column.querySelector('.participants').firstElementChild.remove()
  })
}

module.exports = { initialize }
