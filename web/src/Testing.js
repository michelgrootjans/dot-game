const Card = require("./Card");

const initialize = (subscribe) => {
  const $testspace = document.getElementById('testspace')

  if (!$testspace) return;

  const workColumnId = $testspace.dataset.columnId;

  subscribe('TaskMoved', (event) => {
    if(event.to.columnId !== workColumnId) return;

    const card = Card.find(event);

    const answers = card.querySelector('.previous-puzzles');
    card?.payload?.tasks.forEach(task => {
      const answer = document.createElement('p');
      answer.innerText = `${task.question + task.actualAnswer} ${task.success ? '✅' : '❌'}`;
      answers.append(answer);
    });

    console.log(card.payload)
  });

};

module.exports = {
  initialize
};