const initial5PlayerState = () => {
  const tasks = [
    {id: 't1', title: 'Backlog'},
    {id: 't2', title: 'Analysis'},
    {id: 't3', title: 'Development'},
    {id: 't4', title: 'Ops'},
    {id: 't5', title: 'QA'},
  ]

  return ({
    columns: [
      {
        columnId: 'c1',
        columnType: 'todo-column',
        nextColumnId: 'c2',
        title: tasks[0].title,
        taskName: tasks[0].id,
      },
      {
        columnId: 'c2',
        columnType: 'work-column',
        nextColumnId: 'c3',
        title: tasks[1].title,
        taskName: tasks[1].id,
        difficulty: 1,
      },
      {
        columnId: 'c3',
        columnType: 'wait-column',
        nextColumnId: 'c4',
        title: '',
      },
      {
        columnId: 'c4',
        columnType: 'work-column',
        nextColumnId: 'c5',
        title: tasks[2].title,
        taskName: tasks[2].id,
        difficulty: 3,
      },
      {
        columnId: 'c5',
        columnType: 'wait-column',
        nextColumnId: 'c6',
        title: '',
      },
      {
        columnId: 'c6',
        columnType: 'work-column',
        nextColumnId: 'c7',
        title: tasks[3].title,
        taskName: tasks[3].id,
        difficulty: 2,
      },
      {
        columnId: 'c7',
        columnType: 'wait-column',
        nextColumnId: 'c8',
        title: '',
      },
      {
        columnId: 'c8',
        columnType: 'test-column',
        nextColumnId: 'c9',
        title: tasks[4].title,
        taskName: tasks[4].id,
      },
      {
        columnId: 'c9',
        columnType: 'done-column',
        title: 'Done',
        taskName: 'done',
      },
      {
        columnId: 'c10',
        columnType: 'fail-column',
        title: 'Defects',
        taskName: 'defect',
      },
    ],
  });
}
module.exports = initial5PlayerState
