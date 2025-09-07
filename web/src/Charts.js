const Cfd = require('./CFD')
const ScatterPlot = require('./ScatterPlot')
const Timer = require('./Timer')

const setCurrentIteration = (iterationId) => {
  document.querySelectorAll('.iteration.current').forEach((element) => element.classList.remove('current'))
  document.querySelectorAll(`.iteration[data-iteration-id="${iterationId}"]`).forEach((element) => element.classList.add('current'))
}

const initialize = (gameId) => {
  const $cfd = document.getElementById('cfd')
  const $scatter = document.getElementById('scatter')
  if (!$cfd || !$scatter) return

  const cfd = Cfd($cfd, gameId)
  const scatter = ScatterPlot($scatter)
  let timer = undefined

  const update = async (iterationId) => {
    await cfd.update(iterationId)
    scatter.update(iterationId)
  }

  document.addEventListener('IterationStarted', ({ detail }) => {
    cfd.clear()
    cfd.initialize(detail)

    timer = Timer(detail.duration).start(() => update(detail.iterationId))
    setCurrentIteration(detail.iterationId)
  })

  document.addEventListener('IterationFinished', ({ detail }) => {
    timer.stop()

    const iterationId = detail.iterationId

    document.querySelectorAll(`.show-previous-iteration[data-iteration-id="${iterationId}"]`).forEach((element) => {
      element.addEventListener('click', () => {
        update(iterationId).then(() => {
          setCurrentIteration(iterationId)
        })
      })
    })
  })
}

module.exports = { initialize }
