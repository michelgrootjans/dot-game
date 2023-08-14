const Card = require('./Card')

const initialize = () => {
  const $workspace = document.getElementById('workspace')

  if (!$workspace) return

  const workColumnId = $workspace.dataset.columnId

  const generateQuestion = (detail) => {
    const card = Card.find(detail)
    const task = card.payload.tasks[workColumnId]
    card.querySelector('.question').innerHTML = task.question
    card.querySelector('.answer').addEventListener('change', (event) => {
      const actualAnswer = event.target.value
      task.actualAnswer = actualAnswer
      task.success = actualAnswer === task.answer
    })
  }

  document.addEventListener('TaskMoved', ({ detail }) => {
    if (detail.to.columnId !== workColumnId) return

    generateQuestion(detail)
  })
}

module.exports = {
  initialize,
}
