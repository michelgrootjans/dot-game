const StatsRepository = () => {
  const stats = []

  const add = (item) => stats.push(item)
  const find = (gameId, iterationId) => {
    if (iterationId) {
      return stats.find((s) => s.iterationId === iterationId)
    } else {
      return stats.find((s) => s.gameId === gameId)
    }
  }

  return {
    add,
    find,
  }
}

module.exports = StatsRepository
