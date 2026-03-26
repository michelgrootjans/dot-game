const initialize = () => {
  const $progressBar = document.getElementById('progressbar')
  const $slider = document.getElementById('timeline-slider')
  if (!$progressBar || !$slider) return

  const columns = Array.from(document.querySelectorAll('[data-column-id]')).reduce((map, el) => {
    map[el.dataset.columnId] = el.querySelector('.tasks')
    return map
  }, {})

  const timelines = {}
  let displayIterationId = null

  const captureSnapshot = (iterationId, timestamp) => {
    const timeline = timelines[iterationId]
    if (!timeline) return
    timeline.snapshots.push({
      timestamp,
      board: Object.fromEntries(
        Object.entries(columns).map(([id, tasksEl]) => [
          id,
          Array.from(tasksEl.children).map((node) => node.cloneNode(true)),
        ])
      ),
    })
  }

  const nearestSnapshot = (iterationId, timestamp) => {
    const snapshots = timelines[iterationId]?.snapshots ?? []
    let result = snapshots[0]
    for (const snapshot of snapshots) {
      if (snapshot.timestamp <= timestamp) result = snapshot
      else break
    }
    return result
  }

  const restoreBoard = (snapshot) => {
    if (!snapshot) return
    Object.entries(columns).forEach(([id, tasksEl]) => {
      tasksEl.replaceChildren(...(snapshot.board[id] ?? []).map((node) => node.cloneNode(true)))
    })
  }

  const activateSlider = (iterationId) => {
    displayIterationId = iterationId
    const timeline = timelines[iterationId]
    if (!timeline?.endTime) return
    $slider.min = timeline.startTime
    $slider.max = timeline.endTime
    $slider.value = timeline.endTime
    $progressBar.hidden = true
    $slider.hidden = false
  }

  document.addEventListener('IterationStarted', ({ detail }) => {
    timelines[detail.iterationId] = {
      startTime: detail.startTime,
      endTime: null,
      snapshots: [
        {
          timestamp: detail.startTime,
          board: Object.fromEntries(Object.keys(columns).map((id) => [id, []])),
        },
      ],
    }
    $slider.hidden = true
    $progressBar.hidden = false
  })

  document.addEventListener('IterationFinished', ({ detail }) => {
    const timeline = timelines[detail.iterationId]
    if (timeline) timeline.endTime = detail.endTime
    activateSlider(detail.iterationId)
  })

  document.addEventListener('ReplayIteration', ({ detail }) => {
    activateSlider(detail.iterationId)
  })

  const taskEventTypes = ['TaskCreated', 'TaskMoved', 'TaskFinished', 'TaskRejected']
  taskEventTypes.forEach((type) => {
    document.addEventListener(type, ({ detail }) => {
      captureSnapshot(detail.iterationId, detail.timestamp)
    })
  })

  $slider.addEventListener('input', () => {
    const timestamp = Number($slider.value)
    restoreBoard(nearestSnapshot(displayIterationId, timestamp))
    document.dispatchEvent(
      new CustomEvent('ScrubTo', { detail: { iterationId: displayIterationId, timestamp } })
    )
  })
}

module.exports = { initialize }
