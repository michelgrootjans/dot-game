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

const API = require('./API')

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
        }
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

const Cfd = (context, gameId) => {
  const chart = new Chart(context, config)

  const getHistory = (iterationId) =>
    API(gameId)
      .stats(iterationId)
      .then((response) => response.json())
      .then((response) => response.history)

  const initialize = (detail) => {
    chart.data.datasets = detail.columns
      .filter(column => column.columnType !== 'wait-column')
      .reverse()
      .map((column) => createDataset(column.taskName, column.backgroundColor, column.borderColor))
  }

  const update = async (iterationId) => {
    const newHistory = await getHistory(iterationId)

    const getSeries = (label) => newHistory.map((record) => ({ x: record.time, y: record[label] }))

    chart.data.datasets.forEach((dataset) => (dataset.data = getSeries(dataset.label)))

    chart.update()
  }

  const clear = () => chart.clear()

  return {
    initialize,
    update,
    clear,
  }
}

module.exports = Cfd
