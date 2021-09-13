const Card = require("./Card");
const Puzzle = require("./Puzzle");

const initialize = () => {
  const $workspace = document.getElementById('workspace')
  const $ready = document.querySelector('#workspace-ready .tasks')
  const $questions = document.getElementById('questions')

  if (!($workspace && $ready && $questions)) return;

  const workColumnId = $workspace.dataset.columnId;
  const difficulty = $workspace.dataset.columnDifficulty;

  const createQuestion = taskId => {
    const template = document.getElementById('question-template');

    const clone = template.content.firstElementChild.cloneNode(true);
    const puzzle = Puzzle(difficulty).generate()
    clone.querySelector('.question').innerHTML = puzzle.question;
    clone.querySelector('.answer').addEventListener('change', event => {
      console.log({event})
      const target = event.target;
      if (target.value === puzzle.answer) {
        clone.remove();
        $ready.append(Card.find({taskId}))
      }
    });

    document.addEventListener('TaskMoved', ({detail}) => {
      if(detail.taskId === taskId)
        clone.remove();
    });


    return clone;
  };


  const removeAll = () => {
    const cards = document.getElementsByClassName('question-container');
    while (cards.length > 0) {
      cards[0].parentNode.removeChild(cards[0]);
    }
  };

  document.addEventListener('IterationStarted', removeAll);

  document.addEventListener('TaskMoved', ({detail}) => {
    if(detail.to.columnId !== workColumnId) return;

    $questions.append(createQuestion(detail.taskId))
  });

};

module.exports = {
  initialize
};