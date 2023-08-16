const { CreateGame } = require('../application/api/commands/game')
const { StartIteration, EndIteration } = require('../application/api/commands/iteration')
const { CreateTask, MoveTask, RejectTask } = require('../application/api/commands/task')
const { TaskCreated, TaskMoved, TaskFinished, TaskRejected } = require('../application/api/events/task')
const { IterationFinished, IterationStarted } = require('../application/api/events/iteration')
const TestApplication = require('./TestApplication')
const TestDate = require('./TestDate')
const { GameCreated } = require('../application/api/events/game')

describe('Tasks', () => {
  beforeEach(TestDate.freeze)
  afterEach(TestDate.unfreeze)

  let application = undefined

  beforeEach(() => {
    application = TestApplication()
    application.execute(
      CreateGame({
        gameId: 'g1',
        state: {
          columns: [
            { columnId: 'c1', columnType: 'todo-column', nextColumnId: 'c2', title: 'To do', taskName: 'todo' },
            { columnId: 'c2', columnType: 'work-column', nextColumnId: 'c3', title: 'Analysis', taskName: 'task1', difficulty: 1 },
            { columnId: 'c3', columnType: 'wait-column', nextColumnId: 'c4', title: '', taskName: 'task1' },
            { columnId: 'c4', columnType: 'work-column', nextColumnId: 'c5', title: 'Design', taskName: 'task2', difficulty: 2 },
            { columnId: 'c5', columnType: 'done-column', title: 'Done', taskName: 'done' },
            { columnId: 'c6', columnType: 'fail-column', title: 'Defects', taskName: 'defect' },
          ],
        },
      })
    )
    application.execute(StartIteration({ gameId: 'g1', iterationId: 'i1' }))
  })

  it('creates a task', () => {
    application.execute(CreateTask({ gameId: 'g1', taskId: 't1' }))
    expect(application.eventsFor('g1')).toMatchObject([
      GameCreated({ gameId: 'g1' }),
      IterationStarted({ gameId: 'g1', iterationId: 'i1' }),
      TaskCreated({ gameId: 'g1', iterationId: 'i1', taskId: 't1', column: { columnId: 'c1' } }),
    ])
  })

  it('moves a task', () => {
    application.execute(CreateTask({ gameId: 'g1', taskId: 't1' }))
    application.execute(MoveTask({ gameId: 'g1', taskId: 't1' }))
    expect(application.eventsFor('g1')).toMatchObject([
      GameCreated({ gameId: 'g1' }),
      IterationStarted({ gameId: 'g1' }),
      TaskCreated({ gameId: 'g1', iterationId: 'i1', taskId: 't1', column: { columnId: 'c1' } }),
      TaskMoved({ gameId: 'g1', iterationId: 'i1', taskId: 't1', from: { columnId: 'c1' }, to: { columnId: 'c2' } }),
    ])
  })

  it('rejects a task', () => {
    application.execute(CreateTask({ gameId: 'g1', taskId: 't1' }))
    application.execute(RejectTask({ gameId: 'g1', taskId: 't1' }))
    expect(application.eventsFor('g1')).toMatchObject([
      GameCreated({ gameId: 'g1' }),
      IterationStarted({ gameId: 'g1' }),
      TaskCreated({ gameId: 'g1', iterationId: 'i1', taskId: 't1', column: { columnId: 'c1' } }),
      TaskMoved({ gameId: 'g1', iterationId: 'i1', taskId: 't1', from: { columnId: 'c1' }, to: { columnId: 'c6' } }),
      TaskRejected({ gameId: 'g1', iterationId: 'i1', taskId: 't1', column: { columnId: 'c6' } }),
    ])
  })

  it('moves a task twice', () => {
    application.execute(CreateTask({ gameId: 'g1', taskId: 't1' }))
    application.execute(MoveTask({ gameId: 'g1', taskId: 't1' }))
    application.execute(MoveTask({ gameId: 'g1', taskId: 't1' }))
    expect(application.eventsFor('g1')).toMatchObject([
      GameCreated({ gameId: 'g1' }),
      IterationStarted({ gameId: 'g1' }),
      TaskCreated({ gameId: 'g1', iterationId: 'i1', taskId: 't1', column: { columnId: 'c1' } }),
      TaskMoved({ gameId: 'g1', iterationId: 'i1', taskId: 't1', from: { columnId: 'c1' }, to: { columnId: 'c2' } }),
      TaskMoved({ gameId: 'g1', iterationId: 'i1', taskId: 't1', from: { columnId: 'c2' }, to: { columnId: 'c3' } }),
    ])
  })

  it('moves a task until done', () => {
    application.execute(CreateTask({ gameId: 'g1', taskId: 't1' }))
    for (let i = 1; i < 5; i++) {
      application.execute(MoveTask({ gameId: 'g1', taskId: 't1' }))
    }
    expect(application.eventsFor('g1')).toMatchObject([
      GameCreated({ gameId: 'g1' }),
      IterationStarted({ gameId: 'g1' }),
      TaskCreated({ gameId: 'g1', iterationId: 'i1', taskId: 't1', column: { columnId: 'c1' } }),
      TaskMoved({ gameId: 'g1', iterationId: 'i1', taskId: 't1', from: { columnId: 'c1' }, to: { columnId: 'c2' } }),
      TaskMoved({ gameId: 'g1', iterationId: 'i1', taskId: 't1', from: { columnId: 'c2' }, to: { columnId: 'c3' } }),
      TaskMoved({ gameId: 'g1', iterationId: 'i1', taskId: 't1', from: { columnId: 'c3' }, to: { columnId: 'c4' } }),
      TaskMoved({ gameId: 'g1', iterationId: 'i1', taskId: 't1', from: { columnId: 'c4' }, to: { columnId: 'c5' } }),
      TaskFinished({ gameId: 'g1', iterationId: 'i1', taskId: 't1' }),
    ])
  })

  it('cannot create a task when iteration is finished', () => {
    application.execute(EndIteration({ gameId: 'g1' }))
    application.execute(CreateTask({ gameId: 'g1', taskId: 't1' }))
    expect(application.eventsFor('g1')).toMatchObject([
      GameCreated({ gameId: 'g1' }),
      IterationStarted({ gameId: 'g1' }),
      IterationFinished({ gameId: 'g1' }),
    ])
  })

  it('cannot move a task when iteration is finished', () => {
    application.execute(CreateTask({ gameId: 'g1', taskId: 't1' }))
    application.execute(EndIteration({ gameId: 'g1' }))
    application.execute(MoveTask({ gameId: 'g1', taskId: 't1' }))
    expect(application.eventsFor('g1')).toMatchObject([
      GameCreated({ gameId: 'g1' }),
      IterationStarted({ gameId: 'g1' }),
      TaskCreated({ gameId: 'g1', taskId: 't1' }),
      IterationFinished({ gameId: 'g1' }),
    ])
  })
})
