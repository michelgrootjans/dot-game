const Puzzle = () => {
  const any = (array) => array[Math.floor(Math.random() * array.length)]
  const numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]

  function operatorFor(difficulty) {
    if (difficulty == 2) return any(['x', '/'])
    if (difficulty == 3) return any(['+', '-'])
    return any(['+', '-', 'x', '/'])
  }

  const generate = (difficulty) => {
    if (difficulty == 1) {
      const number = any(numbers)
      return { question: `${number} = `, answer: `${number}` }
    }

    const operator = operatorFor(difficulty)

    if (operator === '+') {
      const first = any(numbers) * 10 + any(numbers)
      const second = any(numbers) * 10 + any(numbers)
      return {
        question: `${first} + ${second} = `,
        answer: `${first + second}`,
      }
    }
    if (operator === '-') {
      const first = any(numbers) * 10 + any(numbers)
      const second = any(numbers) * 10 + any(numbers)
      return {
        question: `${Math.max(first, second)} - ${Math.min(first, second)} = `,
        answer: `${Math.abs(first - second)}`,
      }
    }
    if (operator === 'x') {
      const first = any(numbers)
      const second = any(numbers)
      return {
        question: `${first} x ${second} = `,
        answer: `${first * second}`,
      }
    }
    if (operator === '/') {
      const first = any(numbers) + 1
      const second = any(numbers)
      return {
        question: `${first * second} / ${first} = `,
        answer: `${second}`,
      }
    }
    return { question: '1 + 1 = ', answer: '2' }
  }

  return {
    generate,
  }
}

module.exports = { Puzzle }
