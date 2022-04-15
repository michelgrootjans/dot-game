const {Chart, ArcElement, LineElement, BarElement, PointElement, BarController, BubbleController, DoughnutController, LineController, PieController, PolarAreaController, RadarController, ScatterController, CategoryScale, LinearScale, LogarithmicScale, RadialLinearScale, TimeScale, TimeSeriesScale, Decimation, Filler, Legend, Title, Tooltip, SubTitle} = require('chart.js');
Chart.register(ArcElement, LineElement, BarElement, PointElement, BarController, BubbleController, DoughnutController, LineController, PieController, PolarAreaController, RadarController, ScatterController, CategoryScale, LinearScale, LogarithmicScale, RadialLinearScale, TimeScale, TimeSeriesScale, Decimation, Filler, Legend, Title, Tooltip, SubTitle);

const API = require("./API");

const distinct = (value, index, self) => self.indexOf(value) === index;

const createDataset = (label, color) => ({
  label: label,
  type: 'line',
  data: [],
  fill: true,
  stepped: true,
  pointRadius: 0,
  backgroundColor: `rgba(${color}, 0.1)`,
  borderColor: `rgba(${color}, 1)`,
  borderWidth: 1,
});

const colors = [
  '101, 103, 107',
  '153, 102, 255',
  '54, 162, 235',
  '75, 192, 192',
  '255, 205, 86',
  '255, 159, 64',
  '255, 99, 132',
]

const config = {
  type: 'line',
  data: {
    datasets: []
  },
  options: {
    animation: false,
    scales: {
      x: {
        type: 'linear',
        ticks: {stepSize: 5}
      },
      y: {
        type: 'linear',
        ticks: {stepSize: 5},
        stacked: true,
      },
    },
    plugins: {
      legend: {display: true, position: 'left', align: 'start', reverse: true},
    }
  },
};


const Cfd = (context, gameId) => {
  const chart = new Chart(context, config);

  const getHistory = (iterationId) => API(gameId).stats(iterationId)
    .then(response => response.json())
    .then(response => response.history);

  const initialize = (detail) => {
    chart.data.datasets = detail.columns
      .map(column => column.taskName)
      .filter(distinct)
      .reverse()
      .map((label, index) => createDataset(label, colors[index]))
  };

  const update = async (iterationId) => {
    const newHistory = await getHistory(iterationId);

    const getSeries = label => newHistory.map(record => ({x: record.time, y: record[label]}));

    chart.data.datasets.forEach(dataset => dataset.data = getSeries(dataset.label))

    chart.update()
  };

  const clear = () => chart.clear()

  return {
    initialize,
    update,
    clear
  }
}

module.exports = Cfd;