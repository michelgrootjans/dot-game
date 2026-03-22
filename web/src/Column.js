const Card = require('./Card')

const initialize = () => {
  const columns = Array.from(document.querySelectorAll('[data-column-id]')).reduce((map, item) => {
    map[item.dataset.columnId] = item.querySelector('.tasks')
    return map
  }, {})

  document.addEventListener('TaskCreated', ({ detail }) => {
    columns[detail.column.columnId]?.append(Card.create(detail))
  })

  document.addEventListener('TaskMoved', ({ detail }) => {
    const nextColumn = columns[detail.to.columnId]

    if (nextColumn) {
      nextColumn.append(Card.findOrCreate(detail))
    } else {
      Card.remove(detail)
    }
  })

  const snapshots = {}

  document.addEventListener('IterationFinished', ({ detail }) => {
    snapshots[detail.iterationId] = Object.fromEntries(
      Object.entries(columns).map(([id, tasksEl]) => [
        id,
        Array.from(tasksEl.children).map(child => child.cloneNode(true)),
      ])
    )
  })

  document.addEventListener('ReplayIteration', ({ detail }) => {
    const snapshot = snapshots[detail.iterationId]
    if (!snapshot) return
    Object.entries(columns).forEach(([id, tasksEl]) => {
      tasksEl.replaceChildren(...(snapshot[id] ?? []).map(node => node.cloneNode(true)))
    })
  })
}

module.exports = {
  initialize,
}
