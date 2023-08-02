const API = require('./API')
const $cardTemplate = document.getElementById('card-template')

const create = ({ gameId, taskId, color, payload }) => {
  const card = $cardTemplate.content.firstElementChild.cloneNode(true)

  card.dataset.taskId = taskId
  card.payload = payload || {}

  card.setAttribute('style', `background: ${color};`)
  card.querySelector('.move-button')?.addEventListener('click', (event) => {
    event.preventDefault()
    API(gameId).task.move(taskId, { payload })
  })
  card.querySelector('.reject-button')?.addEventListener('click', (event) => {
    event.preventDefault()
    API(gameId).task.reject(taskId, { payload })
  })
  return card
}

const find = ({ taskId }) => document.querySelector(`[data-task-id="${taskId}"]`)
const findOrCreate = (detail) => find(detail) || create(detail)
const remove = (detail) => find(detail)?.remove()

const removeAll = () => {
  const cards = document.getElementsByClassName('postit')
  while (cards.length > 0) {
    cards[0].parentNode.removeChild(cards[0])
  }
}

document.addEventListener('IterationStarted', removeAll)

module.exports = { create, find, findOrCreate, remove }
