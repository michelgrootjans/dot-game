const {
  Chart,
  ArcElement,
  LineElement,
  BarElement,
  PointElement,
  BarController,
  BubbleController,
  DoughnutController,
  LineController,
  PieController,
  PolarAreaController,
  RadarController,
  ScatterController,
  CategoryScale,
  LinearScale,
  LogarithmicScale,
  RadialLinearScale,
  TimeScale,
  TimeSeriesScale,
  Decimation,
  Filler,
  Legend,
  Title,
  Tooltip,
  SubTitle,
} = require('chart.js')
Chart.register(
  ArcElement,
  LineElement,
  BarElement,
  PointElement,
  BarController,
  BubbleController,
  DoughnutController,
  LineController,
  PieController,
  PolarAreaController,
  RadarController,
  ScatterController,
  CategoryScale,
  LinearScale,
  LogarithmicScale,
  RadialLinearScale,
  TimeScale,
  TimeSeriesScale,
  Decimation,
  Filler,
  Legend,
  Title,
  Tooltip,
  SubTitle
)

const createDataset = (taskName, backgroundColor, borderColor) => ({
  label: taskName,
  type: 'line',
  data: [],
  fill: true,
  stepped: true,
  pointRadius: 0,
  backgroundColor: backgroundColor,
  borderColor: borderColor,
  borderWidth: 1,
})

const config = {
  type: 'line',
  data: {
    datasets: [],
  },
  options: {
    animation: false,
    scales: {
      x: {
        type: 'linear',
        min: 0,
        suggestedMax: 60,
        ticks: { stepSize: 10 },
      },
      y: {
        type: 'linear',
        stacked: true,
        min: 0,
        suggestedMax: 10,
        ticks: { stepSize: 5 },
        title: {
          display: true,
          text: '#items',
          align: 'end',
        },
      },
    },
    plugins: {
      legend: {
        display: true,
        position: 'left',
        align: 'start',
        reverse: true,
      },
    },
  },
}

const Cfd = (context) => {
  const chart = new Chart(context, config)

  const iterationData = {}
  let displayIterationId = null

  const recordSnapshot = (iterationId, timestamp) => {
    const data = iterationData[iterationId]
    data.history.push({ time: (timestamp - data.startTime) / 1000, ...data.counts })
  }

  const render = (iterationId, upToSeconds = Infinity) => {
    const data = iterationData[iterationId]
    if (!data) return
    const points =
      upToSeconds === Infinity
        ? data.history
        : data.history.filter((p) => p.time <= upToSeconds)
    chart.data.datasets.forEach((ds) => {
      ds.data = points.map((p) => ({ x: p.time, y: p[ds.label] ?? 0 }))
    })
    chart.update()
  }

  const initialize = (detail) => {
    displayIterationId = detail.iterationId
    iterationData[detail.iterationId] = {
      startTime: detail.startTime,
      counts: Object.fromEntries(detail.columns.map((c) => [c.taskName, 0])),
      history: [],
    }
    chart.data.datasets = detail.columns
      .filter((c) => c.columnType !== 'wait-column')
      .reverse()
      .map((c) => createDataset(c.taskName, c.backgroundColor, c.borderColor))
    chart.options.scales.x.suggestedMax = detail.duration / 1000
    recordSnapshot(detail.iterationId, detail.startTime)
    render(detail.iterationId)
  }

  const update = (iterationId) => {
    displayIterationId = iterationId
    render(iterationId)
  }

  const scrubTo = (iterationId, timestamp) => {
    const data = iterationData[iterationId]
    if (!data) return
    render(iterationId, (timestamp - data.startTime) / 1000)
  }

  document.addEventListener('TaskCreated', ({ detail }) => {
    const data = iterationData[detail.iterationId]
    if (!data) return
    data.counts[detail.column.taskName]++
    recordSnapshot(detail.iterationId, detail.timestamp)
    if (detail.iterationId === displayIterationId) render(detail.iterationId)
  })

  document.addEventListener('IterationFinished', ({ detail }) => {
    const data = iterationData[detail.iterationId]
    if (!data) return
    recordSnapshot(detail.iterationId, detail.endTime)
    if (detail.iterationId === displayIterationId) render(detail.iterationId)
  })

  document.addEventListener('TaskMoved', ({ detail }) => {
    const data = iterationData[detail.iterationId]
    if (!data) return
    data.counts[detail.from.taskName]--
    data.counts[detail.to.taskName]++
    recordSnapshot(detail.iterationId, detail.timestamp)
    if (detail.iterationId === displayIterationId) render(detail.iterationId)
  })

  const clear = () => chart.clear()

  return {
    initialize,
    update,
    clear,
    scrubTo,
  }
}

module.exports = Cfd
