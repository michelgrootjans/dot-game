const {Chart, ArcElement, LineElement, BarElement, PointElement, BarController, BubbleController, DoughnutController, LineController, PieController, PolarAreaController, RadarController, ScatterController, CategoryScale, LinearScale, LogarithmicScale, RadialLinearScale, TimeScale, TimeSeriesScale, Decimation, Filler, Legend, Title, Tooltip, SubTitle} = require('chart.js');
Chart.register(ArcElement, LineElement, BarElement, PointElement, BarController, BubbleController, DoughnutController, LineController, PieController, PolarAreaController, RadarController, ScatterController, CategoryScale, LinearScale, LogarithmicScale, RadialLinearScale, TimeScale, TimeSeriesScale, Decimation, Filler, Legend, Title, Tooltip, SubTitle);

const ctx = document.getElementById('myChart');

const wip = {
  label: 'wip',
  type: 'line',
  data: [],
  fill: true,
  stepped: true,
  pointRadius: 0,
  backgroundColor: 'rgba(255, 206, 86, 0.1)',
  borderColor: 'rgba(255, 206, 86, 1)',
};
const done = {
  label: 'done',
  type: 'line',
  data: [],
  fill: true,
  stepped: true,
  pointRadius: 0,
  backgroundColor: 'rgba(54, 162, 235, 0.1)',
  borderColor: 'rgba(54, 162, 235, 1)',
};

const config = {
  type: 'line',
  data: {
    datasets: [done, wip]
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
      legend: {display: true},
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
    wip.data = newHistory.map(record => ({x: record.time, y: record.wip}))
    done.data = newHistory.map(record => ({x: record.time, y: record.done}))
    myChart.update()
  };

  const clear = () => {
    wip.data = [];
    done.data = [];
    myChart.clear();
  }

  return {
    update,
    clear
  }
}

module.exports = Graph;