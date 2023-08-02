const API = (gameId) => {
  const apiBase = `/api/games/${gameId}`

  const post = (url, data = {}) =>
    fetch(`${apiBase}/${url}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })

  const get = (url) => fetch(`${apiBase}/${url}`, { method: 'GET' })

  return {
    task: {
      create: (data) => post('tasks', data),
      move: (taskId, data) => post(`tasks/${taskId}/move`, data),
      reject: (taskId, data) => post(`tasks/${taskId}/reject`, data),
    },
    iteration: {
      start: (data) => post(`iterations`, data),
      stop: () => post(`iterations/stop`),
    },
    stats: (iterationId) => get(`iterations/${iterationId}/stats`),
  }
}

module.exports = API
