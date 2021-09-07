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

function deltaBetween(currentHistory, newHistory) {
  return newHistory.slice(currentHistory.length);
}

const Graph = () => {
  const update = async () => {
    const response = await fetch(`/api/games/default/stats`, {method: 'GET'});
    const jsonResponse = await response.json();
    // const currentHistory = data.datasets[0].data;
    const newHistory = jsonResponse.history;
    deltaBetween(currentHistory, newHistory).forEach(point => currentHistory.push(point));
    myChart.update()
  };

  return {
    update
  }
}

module.exports = Graph;