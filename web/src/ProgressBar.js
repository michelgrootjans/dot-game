const Timer = require('./Timer')

const initialize = () => {
  const container = document.querySelector('[data-work-column-id]')
  if (container) {
    container.classList.add('inactive')
    document.addEventListener('IterationStarted', () => container.classList.remove('inactive'))
    document.addEventListener('IterationFinished', () => container.classList.add('inactive'))
  }

  const progressBar = document.getElementById('progressbar')
  if (!progressBar) return

  let timer = undefined

  document.addEventListener('IterationStarted', ({ detail }) => {
    const duration = detail.duration
    const startTime = detail.startTime
    progressBar.max = `${duration}`
    progressBar.hidden = false
    timer = Timer(duration).start(() => (progressBar.value = Date.now() - startTime))
  })

  document.addEventListener('IterationFinished', () => {
    timer.stop()
    progressBar.hidden = true
  })
}

module.exports = { initialize }
