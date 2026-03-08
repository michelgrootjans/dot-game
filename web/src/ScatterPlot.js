const { Chart } = require('chart.js')

class WorkItem {
  constructor(id, dateStarted) {
    this.id = id
    this.dateStarted = dateStarted
    this.state = 'started'
  }

  moveTo(column) {
    this.currentColumn = column.taskName
    this.backgroundColor = column.backgroundColor
    this.borderColor = column.borderColor
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
          borderColor: (point) => point?.raw?.item?.borderColor || 'rgb(255, 99, 132)',
          backgroundColor: (point) => point?.raw?.item?.backgroundColor || 'rgba(255, 99, 132, 0.1)',
        },
        {
          label: 'Finished',
          data: [],
          borderColor: (point) => point?.raw?.item?.borderColor || 'rgb(54, 162, 235)',
          backgroundColor: (point) => point?.raw?.item?.backgroundColor || 'rgba(54, 162, 235, 0.2)',
        },
        {
          label: 'Rejected',
          data: [],
          borderColor: (point) => point?.raw?.item?.borderColor || 'rgb(201, 203, 207)',
          backgroundColor: (point) => point?.raw?.item?.backgroundColor || 'rgba(201, 203, 207, 0.2)',
        },
      ],
    },
    options: {
      animation: false,
      scales: {
        x: {
          type: 'linear',
          min: 0,
          suggestedMax: 60,
          ticks: { stepSize: 10 },
        },
        y: {
          type: 'linear',
          min: 0,
          suggestedMax: 10,
          ticks: { stepSize: 5 },
          title: {
            display: true,
            text: 'Lead Time',
            align: 'end',
          },
        },
      },
      plugins: {
        legend: { display: false, },
        tooltip: {
          callbacks: {
            label: function(context) {
              console.log('Scatter Plot', 'tooltip', { context })
              return context.raw.item.currentColumn
            }
          }
        },
      },
    },
  }

  const chart = new Chart(context, config)
  let startDate = Date.now()

  const update = () => {
    chart.data.datasets[0].data = data
      .filter((item) => item.state === 'started')
      .map((item) => ({ x: item.dateDelivered(startDate), y: item.duration(), item }))

    chart.data.datasets[1].data = data
      .filter((item) => item.state === 'finished')
      .map((item) => ({ x: item.dateDelivered(startDate), y: item.duration(), item }))

    chart.data.datasets[2].data = data
      .filter((item) => item.state === 'rejected')
      .map((item) => ({ x: item.dateDelivered(startDate), y: item.duration(), item }))

    console.log({ data })

    chart.update()
  }

  document.addEventListener('IterationStarted', (event) => {
    console.log('Scatter Plot', 'IterationStarted', { event })

    startDate = Date.now()
    data = []
    chart.clear()

    document.addEventListener('TaskCreated', (event) => {
      console.log('Scatter Plot', 'TaskCreated', { event })
      if (data.find((item) => item.id === event.detail.taskId)) return
      const workItem = new WorkItem(event.detail.taskId, Date.now())
      workItem.moveTo(event.detail.column)
      data.push(workItem)
    })

    document.addEventListener('TaskMoved', (event) => {
      console.log('Scatter Plot', 'TaskMoved', { event })
      const workItem = data.find((item) => item.id === event.detail.taskId)
      workItem.moveTo(event.detail.to)
    })

    document.addEventListener('TaskFinished', (event) => {
      console.log('Scatter Plot', 'TaskFinished', { event })
      const workItem = data.find((item) => item.id === event.detail.taskId)
      workItem.finish(Date.now())
    })

    document.addEventListener('TaskRejected', (event) => {
      console.log('Scatter Plot', 'TaskRejected', { event })
      const workItem = data.find((item) => item.id === event.detail.taskId)
      workItem.reject(Date.now())
    })
  })

  return {
    update,
  }
}

module.exports = ScatterPlot
