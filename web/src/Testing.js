const Card = require('./Card')

const initialize = () => {
  const $testspace = document.getElementById('testspace')

  if (!$testspace) return

  const workColumnId = $testspace.dataset.columnId

  const generateQuestion = (detail) => {}

  document.addEventListener('TaskMoved', ({ detail }) => {
    if (detail.to.columnId !== workColumnId) return

    const card = Card.find(detail)

    const answers = card.querySelector('.previous-puzzles')
    card?.payload?.tasks.forEach((task) => {
      const answer = document.createElement('p')
      answer.innerText = `${task.question + task.actualAnswer} ${task.success ? '✅' : '❌'}`
      answers.append(answer)
    })
  })
}

module.exports = {
  initialize,
}
