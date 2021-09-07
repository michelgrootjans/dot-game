const {Chart, LineController, LineElement, PointElement, LinearScale, Title, CategoryScale, TimeScale, TimeScaleOptions, TimeSeriesScale} = require('chart.js')

Chart.register(LineController, LineElement, PointElement, LinearScale, Title, CategoryScale, TimeScale, TimeScaleOptions, TimeSeriesScale);

const ctx = document.getElementById('myChart');

function newDate(number) {
  return Date.now() + number * 1000 * 60 * 24;
}

let Utils = {
  CHART_COLORS: {red: 1},

  newDate(number) {
    return newDate(number);
  },
  transparentize() {
    return '#673546';
  },
  newDateString(number) {
    return newDate(number).toString();
  },
  rand(number, number2) {
    return number + Math.random() * number2;
  }
};
const data = {
  labels: [ // Date Objects
    Utils.newDate(0),
    Utils.newDate(1),
    Utils.newDate(2),
    Utils.newDate(3),
    Utils.newDate(4),
    Utils.newDate(5),
    Utils.newDate(6)
  ],
  datasets: [{
    label: 'Dataset with point data',
    backgroundColor: Utils.transparentize(),
    fill: false,
    data: [{
      x: Utils.newDateString(0),
      y: Utils.rand(0, 100)
    }, {
      x: Utils.newDateString(5),
      y: Utils.rand(0, 100)
    }, {
      x: Utils.newDateString(7),
      y: Utils.rand(0, 100)
    }, {
      x: Utils.newDateString(15),
      y: Utils.rand(0, 100)
    }],
  }]
};

const config = {
  type: 'line',
  data: data,
  options: {
    plugins: {
      title: {
        text: 'Chart.js Time Scale',
        display: true
      }
    },
    scales: {
      x: {
        type: 'time',
        time: {
          // Luxon format string
          tooltipFormat: 'DD T'
        },
        title: {
          display: true,
          text: 'Date'
        }
      },
      y: {
        title: {
          display: true,
          text: 'value'
        }
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