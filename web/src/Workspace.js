const Card = require("./Card");
const Puzzle = require("./Puzzle");

const initialize = () => {
  const $workspace = document.getElementById('workspace')

  if (!$workspace) return;

  const workColumnId = $workspace.dataset.columnId;
  const difficulty = $workspace.dataset.columnDifficulty;

  const generateQuestion = taskId => {
    const card = Card.find({taskId});
    const puzzle = Puzzle(difficulty).generate()
    card.querySelector('.question').innerHTML = puzzle.question;
    card.querySelector('.answer').addEventListener('change', event => {
      const success = (event.target.value === puzzle.answer);
      card.payload.success = card.payload.success || []
      card.payload.success.push({workColumnId, success})
    });
  };


  const removeAll = () => {
    const questions = document.getElementsByClassName('question-container');
    while (questions.length > 0) {
      questions[0].parentNode.removeChild(questions[0]);
    }
  };

  document.addEventListener('IterationStarted', removeAll);

  document.addEventListener('TaskMoved', ({detail}) => {
    if(detail.to.columnId !== workColumnId) return;

    generateQuestion(detail.taskId);
  });

};

module.exports = {
  initialize
};