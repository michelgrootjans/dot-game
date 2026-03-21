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
    this.dateFinished = dateRejected
    this.state = 'rejected'
  }

  dateDelivered(startDate) {
    return this.diff(startDate, this.dateFinished)
  }

  duration(now) {
    if(this.dateFinished) return this.diff(this.dateStarted, this.dateFinished)
    return this.diff(this.dateStarted, now)
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
  let startDate = undefined
  let endDate = undefined

  const update = () => {

    const now = Math.min(Date.now(), endDate)

    chart.data.datasets[0].data = data
      .filter((item) => item.state === 'started')
      .map((item) => ({ x: (now - startDate)/1000, y: item.duration(now), item }))

    chart.data.datasets[1].data = data
      .filter((item) => item.state === 'finished')
      .map((item) => ({ x: item.dateDelivered(startDate), y: item.duration(now), item }))

    chart.data.datasets[2].data = data
      .filter((item) => item.state === 'rejected')
      .map((item) => ({ x: item.dateDelivered(startDate), y: item.duration(now), item }))

    console.log({ data })

    chart.update()
  }

  document.addEventListener('IterationStarted', (event) => {
    startDate = event.detail.startTime
    endDate = event.detail.startTime + event.detail.duration
    data = []
    chart.clear()

    console.log('Scatter Plot', 'IterationStarted', { event, startDate, endDate, data })

    document.addEventListener('TaskCreated', (event) => {
      if (data.find((item) => item.id === event.detail.taskId)) return
      const workItem = new WorkItem(event.detail.taskId, event.detail.timestamp)
      workItem.moveTo(event.detail.column)
      data.push(workItem)
      console.log('Scatter Plot', 'TaskCreated', { event, startDate, endDate, data })
    })

    document.addEventListener('TaskMoved', (event) => {
      const workItem = data.find((item) => item.id === event.detail.taskId)
      workItem.moveTo(event.detail.to)
      console.log('Scatter Plot', 'TaskMoved', { event, startDate, endDate, data })
    })

    document.addEventListener('TaskFinished', (event) => {
      const workItem = data.find((item) => item.id === event.detail.taskId)
      workItem.finish(event.detail.timestamp)
      console.log('Scatter Plot', 'TaskFinished', { event, startDate, endDate, data })
    })

    document.addEventListener('TaskRejected', (event) => {
      const workItem = data.find((item) => item.id === event.detail.taskId)
      workItem.reject(event.detail.timestamp)
      console.log('Scatter Plot', 'TaskRejected', { event, startDate, endDate, data })
    })

  })

  return {
    update,
  }
}

module.exports = ScatterPlot
