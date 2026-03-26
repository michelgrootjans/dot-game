const { Chart } = require('chart.js')
const Cfd = require('./event-based-cfd')
const ScatterPlot = require('./ScatterPlot')
const Timer = require('./Timer')

const setCurrentIteration = (iterationId) => {
  document.querySelectorAll('.iteration.current').forEach((element) => element.classList.remove('current'))
  document.querySelectorAll(`.iteration[data-iteration-id="${iterationId}"]`).forEach((element) => element.classList.add('current'))
}

let sharedCrosshairValue = null

const crosshairPlugin = {
  id: 'crosshair',
  afterEvent(chart, args) {
    const { event } = args
    if (event.type === 'mousemove') {
      const value = chart.scales.x.getValueForPixel(event.x)
      if (value !== sharedCrosshairValue) {
        sharedCrosshairValue = value
        Object.values(Chart.instances).forEach((c) => { if (c !== chart) c.draw() })
      }
      args.changed = true
    } else if (event.type === 'mouseout') {
      if (sharedCrosshairValue !== null) {
        sharedCrosshairValue = null
        Object.values(Chart.instances).forEach((c) => { if (c !== chart) c.draw() })
        args.changed = true
      }
    }
  },
  afterDraw(chart) {
    if (sharedCrosshairValue == null) return
    const { ctx, chartArea, scales } = chart
    const x = scales.x.getPixelForValue(sharedCrosshairValue)
    if (x < chartArea.left || x > chartArea.right) return
    ctx.save()
    ctx.beginPath()
    ctx.moveTo(x, chartArea.top)
    ctx.lineTo(x, chartArea.bottom)
    ctx.lineWidth = 1
    ctx.strokeStyle = 'rgba(0,0,0,0.4)'
    ctx.stroke()
    ctx.restore()
  },
}

Chart.register(crosshairPlugin)

const initialize = (gameId) => {
  const $cfd = document.getElementById('cfd')
  const $scatter = document.getElementById('scatter')
  if (!$cfd || !$scatter) return

  const cfd = Cfd($cfd)
  const scatter = ScatterPlot($scatter)
  let timer = undefined

  document.addEventListener('IterationStarted', ({ detail }) => {
    cfd.clear()
    cfd.initialize(detail)

    timer = Timer(detail.duration).start(() => scatter.update(detail.iterationId))
    setCurrentIteration(detail.iterationId)
  })

  document.addEventListener('IterationFinished', ({ detail }) => {
    timer.stop()

    const iterationId = detail.iterationId

    document.querySelectorAll(`.show-previous-iteration[data-iteration-id="${iterationId}"]`).forEach((element) => {
      element.addEventListener('click', () => {
        document.dispatchEvent(new CustomEvent('ReplayIteration', { detail: { iterationId } }))
        cfd.update(iterationId)
        scatter.update(iterationId)
        setCurrentIteration(iterationId)
      })
    })
  })
}

module.exports = { initialize }
