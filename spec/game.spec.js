const { CreateGame } = require('../application/api/commands/game')
const { JoinGame, LeaveGame } = require('../application/api/commands/player')
const initialState = require('../application/domain/initial-state')
const fourPlayers = require('../application/domain/initial-4-player-state')
const fivePlayers = require('../application/domain/initial-5-player-state')
const TestApplication = require('./TestApplication')

describe('Game', () => {
  let application = undefined

  beforeEach(() => {
    application = TestApplication()
    jest.useFakeTimers()
  })

  it('defaults to 5 players', () => {
    application.execute(CreateGame({ gameId: 'g1' }))
    expect(application.findGame('g1')).toMatchObject(fivePlayers())
  })

  it('can initialize with 5 players', () => {
    application.execute(CreateGame({ gameId: 'g1', state: initialState(5), numberOfPlayers: 5 }))
    expect(application.findGame('g1')).toMatchObject(fivePlayers())
  })

  it('can initialize with 4 players', () => {
    application.execute(CreateGame({ gameId: 'g1', state: initialState(4), numberOfPlayers: 4 }))
    expect(application.findGame('g1')).toMatchObject(fourPlayers())
  })

  describe('joining a game', () => {
    beforeEach(() => application.execute(CreateGame({ gameId: 'g1' })))
    const game = () => application.findGame('g1')

    it('has no assignments', () => {
      expect(game().isOpen()).toBeTruthy()
      expect(game().findFreeWork()).toBe('c1')
      expect(game().assignments()).toMatchObject([
        { columnId: 'c1', numberOfAssignments: 0 },
        { columnId: 'c2', numberOfAssignments: 0 },
        { columnId: 'c4', numberOfAssignments: 0 },
        { columnId: 'c6', numberOfAssignments: 0 },
        { columnId: 'c8', numberOfAssignments: 0 },
      ])
    })

    it('join column c1', () => {
      application.execute(JoinGame({ gameId: 'g1', columnId: 'c1' }))

      expect(game().isOpen()).toBeTruthy()
      expect(game().findFreeWork()).toBe('c2')
      expect(game().assignments()).toMatchObject([
        { columnId: 'c1', numberOfAssignments: 1 },
        { columnId: 'c2', numberOfAssignments: 0 },
        { columnId: 'c4', numberOfAssignments: 0 },
        { columnId: 'c6', numberOfAssignments: 0 },
        { columnId: 'c8', numberOfAssignments: 0 },
      ])
    })

    it('join column c2', () => {
      application.execute(JoinGame({ gameId: 'g1', columnId: 'c2' }))

      expect(game().isOpen()).toBeTruthy()
      expect(game().findFreeWork()).toBe('c1')
      expect(game().assignments()).toMatchObject([
        { columnId: 'c1', numberOfAssignments: 0 },
        { columnId: 'c2', numberOfAssignments: 1 },
        { columnId: 'c4', numberOfAssignments: 0 },
        { columnId: 'c6', numberOfAssignments: 0 },
        { columnId: 'c8', numberOfAssignments: 0 },
      ])
    })

    it('join then leave column c1', () => {
      application.execute(JoinGame({ gameId: 'g1', columnId: 'c1' }))
      application.execute(LeaveGame({ gameId: 'g1', columnId: 'c1' }))

      expect(game().isOpen()).toBeTruthy()
      expect(game().findFreeWork()).toBe('c1')
      expect(game().assignments()).toMatchObject([
        { columnId: 'c1', numberOfAssignments: 0 },
        { columnId: 'c2', numberOfAssignments: 0 },
        { columnId: 'c4', numberOfAssignments: 0 },
        { columnId: 'c6', numberOfAssignments: 0 },
        { columnId: 'c8', numberOfAssignments: 0 },
      ])
    })

    it('join all free columns', () => {
      application.execute(JoinGame({ gameId: 'g1', columnId: 'c1' }))
      application.execute(JoinGame({ gameId: 'g1', columnId: 'c2' }))
      application.execute(JoinGame({ gameId: 'g1', columnId: 'c4' }))
      application.execute(JoinGame({ gameId: 'g1', columnId: 'c6' }))
      application.execute(JoinGame({ gameId: 'g1', columnId: 'c8' }))

      expect(game().isOpen()).toBeFalsy()
      expect(game().findFreeWork()).toBeUndefined()
      expect(game().assignments()).toMatchObject([
        { columnId: 'c1', numberOfAssignments: 1 },
        { columnId: 'c2', numberOfAssignments: 1 },
        { columnId: 'c4', numberOfAssignments: 1 },
        { columnId: 'c6', numberOfAssignments: 1 },
        { columnId: 'c8', numberOfAssignments: 1 },
      ])
    })
  })
})
