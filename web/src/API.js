const API = (gameId) => {
  const apiBase = `/api/games/${gameId}`

  const post = (endpoint, data = {}) =>
    fetch(`${apiBase}/${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })

  const get = (endpoint) => fetch(`${apiBase}/${endpoint}`, { method: 'GET' })

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
