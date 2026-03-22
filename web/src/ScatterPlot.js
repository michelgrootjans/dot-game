const { Chart } = require('chart.js')

const iterations = {}

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
    if (this.dateFinished) {
      console.warn('WorkItem', 'finish failed', { workItem: this, dateFinished })
      return
    }
    this.dateFinished = dateFinished
    this.state = 'finished'
  }

  reject(dateRejected) {
    if (this.dateFinished) {
      console.warn('WorkItem', 'reject failed', { workItem: this, dateFinished })
      return
    }
    this.dateFinished = dateRejected
    this.state = 'rejected'
  }

  cycleTime() {
    return this.dateFinished - this.dateStarted
  }
}

const ScatterPlot = (context) => {
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
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: function (context) {
              console.log('Scatter Plot', 'tooltip', { context })
              return context.raw.item.currentColumn
            },
          },
        },
      },
    },
  }

  const chart = new Chart(context, config)

  const update = (iterationId) => {
    const iteration = iterations[iterationId]
    const data = iteration.data
    const iterationStart = iteration.startDate
    const iterationEnd = iteration.endDate
    const now = Math.min(Date.now(), iterationEnd)

    chart.data.datasets[0].data = data
      .filter((item) => item.state === 'started')
      .map((item) => ({
        x: (now - iterationStart) / 1000,
        y: (now - item.dateStarted) / 1000,
        item,
      }))

    chart.data.datasets[1].data = data
      .filter((item) => item.state === 'finished')
      .map((item) => ({
        x: (item.dateFinished - iterationStart) / 1000,
        y: item.cycleTime() / 1000,
        item,
      }))

    chart.data.datasets[2].data = data
      .filter((item) => item.state === 'rejected')
      .map((item) => ({
        x: (item.dateFinished - iterationStart) / 1000,
        y: item.cycleTime() / 1000,
        item,
      }))

    chart.update()
  }

  document.addEventListener('IterationStarted', (event) => {
    iterations[event.detail.iterationId] = {
      id: event.detail.iterationId,
      startDate: event.detail.startTime,
      endDate: event.detail.startTime + event.detail.duration,
      data: [],
    }
    chart.clear()
  })

  document.addEventListener('TaskCreated', (event) => {
    const iteration = iterations[event.detail.iterationId]
    const workItem = new WorkItem(event.detail.taskId, event.detail.timestamp)
    workItem.moveTo(event.detail.column)
    iteration.data.push(workItem)
  })

  document.addEventListener('TaskMoved', (event) => {
    const iteration = iterations[event.detail.iterationId]
    const workItem = iteration.data.find((item) => item.id === event.detail.taskId)
    workItem.moveTo(event.detail.to)
  })

  document.addEventListener('TaskFinished', (event) => {
    const iteration = iterations[event.detail.iterationId]
    const workItem = iteration.data.find((item) => item.id === event.detail.taskId)
    workItem.finish(event.detail.timestamp)
  })

  document.addEventListener('TaskRejected', (event) => {
    const iteration = iterations[event.detail.iterationId]
    const workItem = iteration.data.find((item) => item.id === event.detail.taskId)
    workItem.reject(event.detail.timestamp)
  })

  return {
    update,
  }
}

module.exports = ScatterPlot
