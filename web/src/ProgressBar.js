const Timer = require('./Timer')

const initialize = () => {
  const progressBar = document.getElementById('progressbar')
  if (!progressBar) return

  let timer = undefined

  document.addEventListener('IterationStarted', ({ detail }) => {
    const duration = detail.duration
    const startTime = detail.startTime
    progressBar.max = `${duration}`
    timer = Timer(duration).start(
      () => (progressBar.value = Date.now() - startTime)
    )
  })

  document.addEventListener('IterationFinished', () => timer.stop())
}

module.exports = { initialize }
