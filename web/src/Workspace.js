const Card = require("./Card");
const Puzzle = require("./Puzzle");

const initialize = () => {
  const $workspace = document.getElementById('workspace')

  if (!$workspace) return;

  const workColumnId = $workspace.dataset.columnId;
  const difficulty = $workspace.dataset.columnDifficulty;

  const generateQuestion = detail => {
    const card = Card.find(detail);
    const puzzle = Puzzle().generate(difficulty)
    card.querySelector('.question').innerHTML = puzzle.question;
    card.payload.tasks = card.payload.tasks || []
    card.payload.tasks.push({workColumnId, question: puzzle.question})
    card.querySelector('.answer').addEventListener('change', event => {
      const task = card.payload.tasks.find(x => x.workColumnId === workColumnId);
      const actualAnswer = event.target.value;
      task.actualAnswer = actualAnswer
      task.success = (actualAnswer === puzzle.answer);
    });
  };

  document.addEventListener('TaskMoved', ({detail}) => {
    if(detail.to.columnId !== workColumnId) return;

    generateQuestion(detail);

    card.querySelector(".answer").focus();
  });

};

module.exports = {
  initialize
};