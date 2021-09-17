const API = gameId => {
  const apiBase = `/api/games/${gameId}`;

  const post = (url, data = {}) => fetch(`${apiBase}/${url}`, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(data)
  });

  const get = url => fetch(`${apiBase}/${url}`, {method: 'GET'});

  return {
    task: {
      create: (payload) => post('tasks', {payload}),
      move: (taskId, payload) => post(`tasks/${taskId}/move`, {payload}),
      reject: (taskId, payload) => post(`tasks/${taskId}/reject`, {payload}),
    },
    iteration: {
      start: data => post(`iterations`, data),
      stop: () => post(`iterations/stop`),
    },
    stats: () => get(`stats`)
  }
}

module.exports = API;