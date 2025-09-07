const { Chart } = require('chart.js')

// const CHART_COLORS = {
//   red: 'rgb(255, 99, 132)',
//   orange: 'rgb(255, 159, 64)',
//   yellow: 'rgb(255, 205, 86)',
//   green: 'rgb(75, 192, 192)',
//   blue: 'rgb(54, 162, 235)',
//   purple: 'rgb(153, 102, 255)',
//   grey: 'rgb(201, 203, 207)'
// };

class WorkItem {
  constructor(id, dateStarted) {
    this.id = id
    this.dateStarted = dateStarted
    this.state = 'started'
  }

  finish(dateFinished) {
    this.dateFinished = dateFinished
    this.state = 'finished'
  }

  reject(dateRejected) {
    this.dateRejected = dateRejected
    this.state = 'rejected'
  }

  dateDelivered(startDate) {
    if (this.dateFinished) return this.diff(startDate, this.dateFinished)
    if (this.dateRejected) return this.diff(startDate, this.dateRejected)
    return this.diff(startDate, Date.now())
  }

  duration() {
    if (this.dateFinished) return this.diff(this.dateStarted, this.dateFinished)
    if (this.dateRejected) return this.diff(this.dateStarted, this.dateRejected)
    return this.diff(this.dateStarted, Date.now())
  }

  diff = (from, to) => {
    return (to - from) / 1000
  }
}

const ScatterPlot = (context) => {
  let data = []

  const config = {
    type: 'scatter',
    data: {
      datasets: [
        {
          label: 'In Progress',
          data: [],
          borderColor: 'rgb(255, 99, 132)',
          backgroundColor: 'rgba(255, 99, 132, 0.2)',
        },
        {
          label: 'Finished',
          data: [],
          borderColor: 'rgb(54, 162, 235)',
          backgroundColor: 'rgba(54, 162, 235, 0.2)',
        },
        {
          label: 'Rejected',
          data: [],
          borderColor: 'rgb(201, 203, 207)',
          backgroundColor: 'rgba(201, 203, 207, 0.2)',
        },
      ],
    },
    options: {
      animation: false,
      scales: {
        x: {
          type: 'linear',
          position: 'bottom',
          startAtZero: true,
          min: 0,
          suggestedMax: 50,
        },
        y: {
          type: 'linear',
          startAtZero: true,
          min: 0,
          suggestedMax: 50,
        },
      },
      plugins: {
        legend: {
          display: false,
          position: 'bottom',
          align: 'start',
        },
      },
    },
  }

  const chart = new Chart(context, config)
  let startDate = Date.now()

  const update = () => {
    chart.data.datasets[0].data = data
      .filter((item) => item.state === 'started')
      .map((item) => ({ x: item.dateDelivered(startDate), y: item.duration() }))

    chart.data.datasets[1].data = data
      .filter((item) => item.state === 'finished')
      .map((item) => ({ x: item.dateDelivered(startDate), y: item.duration() }))

    chart.data.datasets[2].data = data
      .filter((item) => item.state === 'rejected')
      .map((item) => ({ x: item.dateDelivered(startDate), y: item.duration() }))

    console.log({ data })

    chart.update()
  }

  document.addEventListener('IterationStarted', () => {
    startDate = Date.now()
    data = []
    chart.clear()

    document.addEventListener('TaskCreated', (event) => {
      console.log('TaskCreated', event.detail.taskId)
      if (data.find((item) => item.id === event.detail.taskId)) return
      data.push(new WorkItem(event.detail.taskId, Date.now()))
    })

    document.addEventListener('TaskFinished', (event) => {
      console.log('TaskFinished', event.detail.taskId)
      const workItem = data.find((item) => item.id === event.detail.taskId)
      workItem.finish(Date.now())
    })

    document.addEventListener('TaskRejected', (event) => {
      console.log('TaskRejected', event.detail.taskId)
      const workItem = data.find((item) => item.id === event.detail.taskId)
      workItem.reject(Date.now())
    })
  })

  return {
    update,
  }
}

module.exports = ScatterPlot
