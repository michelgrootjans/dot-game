const {
  Chart,
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  Title,
  CategoryScale,
  TimeScale
} = require('chart.js')

Chart.register(LineController, LineElement, PointElement, LinearScale, Title, CategoryScale, TimeScale);

const ctx = document.getElementById('myChart');

let currentHistory = [];

const data = {
  datasets: [{
    data: currentHistory,
    parsing: {
      xAxisKey: 'time',
      yAxisKey: 'wip',
    }
  }]
};

const config = {
  type: 'line',
  data: data,
  options: {
    plugins: {},
    scales: {
      x: {
        type: 'linear'
      },
      y: {
        type: 'linear'
      }
    },
  },
};


var myChart = new Chart(ctx, config);

myChart.update();

let t = 0;

const deltaBetween = (smallArray, bigArray) => bigArray.slice(smallArray.length);

function fetchHistory() {
  return (fetch(`/api/games/default/stats`, {method: 'GET'})).then(response => response.json().then(response => response.history));
}

const Graph = () => {
  const update = async () => {
    const newHistory = await fetchHistory();
    deltaBetween(currentHistory, newHistory).forEach(point => currentHistory.push(point));
    myChart.update()
  };

  const clear = () => {
    currentHistory.length = 0;
    myChart.clear();
  }

  return {
    update,
    clear
  }
}

module.exports = Graph;