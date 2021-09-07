const {Chart, LineController, LineElement, PointElement, LinearScale, Title, CategoryScale} = require('chart.js')

Chart.register(LineController, LineElement, PointElement, LinearScale, Title, CategoryScale);

const ctx = document.getElementById('myChart');
var myChart = new Chart(ctx, {
  type: 'line',
  data: {
    datasets: [{
      label: '# of Votes',
      data: [{x: 'Red', y: 12}, {x: 'Blue', y: 19}, {x: 'Yellow', y: 3}, {x: 'Green', y: 5}, {x: 'Purple', y: 2}, {x: 'Orange', y: 3}],
      backgroundColor: [
        'rgba(255, 99, 132, 0.2)',
        'rgba(54, 162, 235, 0.2)',
        'rgba(255, 206, 86, 0.2)',
        'rgba(75, 192, 192, 0.2)',
        'rgba(153, 102, 255, 0.2)',
        'rgba(255, 159, 64, 0.2)'
      ],
      borderColor: [
        'rgba(255, 99, 132, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(153, 102, 255, 1)',
        'rgba(255, 159, 64, 1)'
      ],
      borderWidth: 1
    }]
  },
  options: {
    scales: {
      y: {
        beginAtZero: true
      }
    }
  }
});

chart.update();

const Graph = () => {
  const update = () => {
  }
  return {
    update
  }
}

module.exports = Graph;