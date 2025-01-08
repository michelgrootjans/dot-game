const initial5PlayerState = (tasks) =>
    ({
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
          taskName: tasks[1].id,
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
          taskName: tasks[2].id,
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
          taskName: tasks[3].id,
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
          taskName: 'Done',
        },
        {
          columnId: 'c10',
          columnType: 'fail-column',
          title: 'Defects',
          taskName: 'Defects',
        },
      ],
    })
module.exports = initial5PlayerState
