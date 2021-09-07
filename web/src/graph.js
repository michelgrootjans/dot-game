const {Chart, LineController, LineElement, PointElement, LinearScale, Title, CategoryScale, TimeScale} = require('chart.js')

Chart.register(LineController, LineElement, PointElement, LinearScale, Title, CategoryScale, TimeScale);

const ctx = document.getElementById('myChart');

const randomize = (from, to) => from + Math.random() * to;

const data = {
  datasets: [{
    data: [{
      x: 0,
      y: randomize(0, 100)
    }, {
      x: 5,
      y: randomize(0, 100)
    }, {
      x: 7,
      y: randomize(0, 100)
    }, {
      x: 15,
      y: randomize(0, 100)
    }],
  }]
};

const config = {
  type: 'line',
  data,
  options: {
    plugins: {
    },
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

const Graph = () => {
  const update = () => {
  }
  return {
    update
  }
}

module.exports = Graph;