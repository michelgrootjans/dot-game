const {Chart, LineController, LineElement, PointElement, LinearScale, Title, CategoryScale, TimeScale} = require('chart.js')

Chart.register(LineController, LineElement, PointElement, LinearScale, Title, CategoryScale, TimeScale);

const ctx = document.getElementById('myChart');

const randomize = (from, to) => from + Math.random() * to;

const subdata = [{
  time: 0,
  wip: randomize(0, 10)
}, {
  time: 5,
  wip: randomize(0, 10)
}, {
  time: 7,
  wip: randomize(0, 10)
}, {
  time: 15,
  wip: randomize(0, 10)
}];
const data = {
  datasets: [{
    data: subdata,
    parsing: {
      xAxisKey: 'time',
      yAxisKey: 'wip',
    }
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