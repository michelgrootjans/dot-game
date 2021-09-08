const {Chart, ArcElement, LineElement, BarElement, PointElement, BarController, BubbleController, DoughnutController, LineController, PieController, PolarAreaController, RadarController, ScatterController, CategoryScale, LinearScale, LogarithmicScale, RadialLinearScale, TimeScale, TimeSeriesScale, Decimation, Filler, Legend, Title, Tooltip, SubTitle} = require('chart.js');
Chart.register(ArcElement, LineElement, BarElement, PointElement, BarController, BubbleController, DoughnutController, LineController, PieController, PolarAreaController, RadarController, ScatterController, CategoryScale, LinearScale, LogarithmicScale, RadialLinearScale, TimeScale, TimeSeriesScale, Decimation, Filler, Legend, Title, Tooltip, SubTitle);

const ctx = document.getElementById('myChart');

const createDataset = (label, color) => ({
  label: label,
  type: 'line',
  data: [],
  fill: true,
  stepped: true,
  pointRadius: 0,
  backgroundColor: `rgba(${color}, 0.1)`,
  borderColor: `rgba(${color}, 1)`,
});

const todo = createDataset('todo', '255, 99, 132');
const analysis = createDataset('analysis', '255, 159, 64');
const design = createDataset('design', '255, 205, 86');
const development = createDataset('development', '75, 192, 192');
const qa = createDataset('qa', '54, 162, 235');
const done = createDataset('done', '153, 102, 255');

const config = {
  type: 'line',
  data: {
    datasets: [done, qa, development, design, analysis, todo]
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
      title: { display: true, text: 'Cumulative Flow Diagram', position: 'bottom'}
    }
  },
};


var myChart = new Chart(ctx, config);

myChart.update();

const fetchHistory = () => fetch(`/api/games/default/stats`, {method: 'GET'})
                            .then(response => response.json())
                            .then(response => response.history);

const Graph = () => {
  const update = async () => {
    const newHistory = await fetchHistory();
    todo.data = newHistory.map(record => ({x: record.time, y: record.todo}))
    analysis.data = newHistory.map(record => ({x: record.time, y: record.analysis}))
    design.data = newHistory.map(record => ({x: record.time, y: record.design}))
    development.data = newHistory.map(record => ({x: record.time, y: record.development}))
    qa.data = newHistory.map(record => ({x: record.time, y: record.qa}))
    done.data = newHistory.map(record => ({x: record.time, y: record.done}))
    myChart.update()
  };

  const clear = () => {
    todo.data = [];
    done.data = [];
    myChart.clear();
  }

  return {
    update,
    clear
  }
}

module.exports = Graph;