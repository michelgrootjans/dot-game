const {Chart, LineController, LineElement, PointElement, LinearScale, Title, CategoryScale, TimeScale} = require('chart.js')

Chart.register(LineController, LineElement, PointElement, LinearScale, Title, CategoryScale, TimeScale);

const ctx = document.getElementById('myChart');

const randomize = (from, to) => from + Math.random() * to;

const subdata = [];

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

let t = 0;
const Graph = () => {
  const update = () => {
    t += randomize(0, 1);
    subdata.push({time: t, wip: randomize(0, 10)});
    myChart.update()
  };
  return {
    update
  }
}

module.exports = Graph;