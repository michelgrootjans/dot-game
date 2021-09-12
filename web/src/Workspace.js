const Card = require("./Card");

function Puzzle() {
  const any = array => array[Math.floor(Math.random() * array.length)];
  const numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
  const operators = ['+', '-', 'x', '/'];

  const generate = () => {
    const operator = any(operators)
    if (operator === '+') {
      const first = 5 * any(numbers) + any(numbers)
      const second = 5 * any(numbers) + any(numbers)
      return {question: `${first} + ${second} = `, answer: `${first + second}`}
    }
    if (operator === '-') {
      const first = 10 * any(numbers) + any(numbers)
      const second = 5 * any(numbers) + any(numbers)
      return {question: `${first} - ${second} = `, answer: `${first - second}`}
    }
    if (operator === 'x') {
      const first = any(numbers)
      const second = any(numbers)
      return {question: `${first} x ${second} = `, answer: `${first * second}`}
    }
    if (operator === '/') {
      const first = any(numbers) + 1
      const second = any(numbers)
      return {question: `${first*second} / ${first} = `, answer: `${second}`}
    }
    return {question: '1 + 1 = ', answer: '2'};
  }

  return {
    generate
  }
}

const initialize = () => {
  const $workspace = document.getElementById('workspace')
  const $ready = document.querySelector('#workspace-ready .tasks')
  const $questions = document.getElementById('questions')

  if (!($workspace && $ready && $questions)) return;

  const workColumnId = $workspace.dataset.columnId;

  const createQuestion = taskId => {
    const template = document.getElementById('question-template');

    const clone = template.content.firstElementChild.cloneNode(true);
    const puzzle = Puzzle().generate()
    clone.querySelector('.question').innerHTML = puzzle.question;
    clone.querySelector('.answer').addEventListener('blur', event => {
      console.log({event})
      const target = event.target;
      if (target.value === puzzle.answer) {
        clone.remove();
        $ready.append(Card.find({taskId}))
      }
    });

    return clone;
  };


  document.addEventListener('TaskMoved', ({detail}) => {
    if(detail.to.columnId !== workColumnId) return;

    $questions.append(createQuestion(detail.taskId))
  });

};

module.exports = {
  initialize
};