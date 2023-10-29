const any = (array) => array[Math.floor(Math.random() * array.length)]
const _0_9 = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
const _1_10 = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
const _1_9 = [1, 2, 3, 4, 5, 6, 7, 8, 9]

const operatorFor = (difficulty) => {
  if (difficulty <= 2) return any(['x', '/'])
  else return any(['+', '-'])
}

const numberWithDigits = (numberOfDigits = 1) => {
  if (numberOfDigits <= 1) return any(_1_9)
  return numberWithDigits(numberOfDigits - 1) * 10 + any(_0_9)
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
      const first = numberWithDigits(difficulty - 1)
      const second = numberWithDigits(difficulty - 1)
      return {
        question: `${first} + ${second} = `,
        answer: `${first + second}`,
      }
    }

    if (operator === '-') {
      const a = numberWithDigits(difficulty - 1)
      const b = numberWithDigits(difficulty - 1)
      const left = Math.max(a, b);
      const right = Math.min(a, b);
      return {
        question: `${left} - ${right} = `,
        answer: `${left - right}`,
      }
    }
    return { question: '1 + 1 = ', answer: '2' }
  }

  return {
    generate,
  }
}

module.exports = { Puzzle }
