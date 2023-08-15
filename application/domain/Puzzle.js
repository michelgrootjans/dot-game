const any = (array) => array[Math.floor(Math.random() * array.length)]
const _0_9 = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
const _1_10 = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
const _1_9 = [1, 2, 3, 4, 5, 6, 7, 8, 9]

function operatorFor(difficulty) {
  if (difficulty === 2) return any(['x', '/'])
  if (difficulty === 3) return any(['+', '-'])
  if (difficulty === 4) return any(['+', '-'])
  return any(['+', '-', 'x', '/'])
}

function numberWithDigits(numberOfDigits = 1) {
  if (numberOfDigits === 1) {
    return any(_1_9);
  }
  if (numberOfDigits === 2) {
    return any(_1_9) * 10 + any(_0_9);
  }
  if (numberOfDigits === 3) {
    return any(_1_9) * 100 + any(_0_9) * 10 + any(_0_9);
  }
  return 0;
}

const Puzzle = () => {
  const generate = (difficulty) => {
    if (difficulty === 1) {
      const number = any(_0_9)
      return { question: `${number} = `, answer: `${number}` }
    }

    const operator = operatorFor(difficulty)

    if (operator === 'x') {
      const first = any(_1_10)
      const second = any(_1_10)
      return {
        question: `${first} x ${second} = `,
        answer: `${first * second}`,
      }
    }
    if (operator === '/') {
      const first = any(_1_10)
      const second = any(_1_10)
      return {
        question: `${first * second} / ${first} = `,
        answer: `${second}`,
      }
    }
    if (operator === '+') {
      const first = numberWithDigits(2)
      const second = numberWithDigits(2)
      return {
        question: `${first} + ${second} = `,
        answer: `${first + second}`,
      }
    }
    if (operator === '-') {
      const first = numberWithDigits(3)
      const second = numberWithDigits(3)
      return {
        question: `${Math.max(first, second)} - ${Math.min(first, second)} = `,
        answer: `${first - second}`,
      }
    }
    return { question: '1 + 1 = ', answer: '2' }
  }

  return {
    generate,
  }
}

module.exports = { Puzzle }
