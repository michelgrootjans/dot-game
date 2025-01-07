const initial4PlayerState = () => ({
  columns: [
    {
      columnId: 'c1',
      columnType: 'todo-column',
      nextColumnId: 'c2',
      title: 'To do',
      taskName: 'todo',
    },
    {
      columnId: 'c2',
      columnType: 'work-column',
      nextColumnId: 'c3',
      title: 'Analysis',
      taskName: 'analysis',
      difficulty: 2,
    },
    {
      columnId: 'c3',
      columnType: 'wait-column',
      nextColumnId: 'c4',
      title: '',
      taskName: 'analysis',
    },
    {
      columnId: 'c4',
      columnType: 'work-column',
      nextColumnId: 'c5',
      title: 'Development',
      taskName: 'development',
      difficulty: 3,
    },
    {
      columnId: 'c5',
      columnType: 'wait-column',
      nextColumnId: 'c6',
      title: '',
      taskName: 'development',
    },
    {
      columnId: 'c6',
      columnType: 'test-column',
      nextColumnId: 'c7',
      title: 'QA',
      taskName: 'qa',
    },
    {
      columnId: 'c7',
      columnType: 'done-column',
      title: 'Done',
      taskName: 'done',
    },
    {
      columnId: 'c8',
      columnType: 'fail-column',
      title: 'Defects',
      taskName: 'defect',
    },
  ],
})
module.exports = initial4PlayerState
