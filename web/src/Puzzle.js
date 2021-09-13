const Puzzle = difficulty => {
  const any = array => array[Math.floor(Math.random() * array.length)];
  const numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
  const operators = ['+', '-', 'x', '/'];

  const generate = () => {
    const operator = any(operators)

    if (operator === '+') {
      const first = 5 * (difficulty - 1) * any(numbers) + any(numbers)
      const second = 5 * (difficulty - 1) * any(numbers) + any(numbers)
      return {question: `${first} + ${second} = `, answer: `${first + second}`}
    }
    if (operator === '-') {
      const first = 10 * (difficulty - 1) * any(numbers) + any(numbers)
      const second = 5 * (difficulty - 1) * any(numbers) + any(numbers)
      return {question: `${Math.max(first, second)} - ${Math.min(first, second)} = `, answer: `${Math.abs(first - second)}`}
    }
    if (operator === 'x') {
      const first = any(numbers)
      const second = any(numbers)
      return {question: `${first} x ${second} = `, answer: `${first * second}`}
    }
    if (operator === '/') {
      const first = (any(numbers) + 1) * difficulty
      const second = any(numbers)
      return {question: `${first*second} / ${first} = `, answer: `${second}`}
    }
    return {question: '1 + 1 = ', answer: '2'};
  }

  return {
    generate
  }
};

module.exports = Puzzle;