const initialState = () => ({
    columns: [
      {columnId: "c1", columnType: "start-column", nextColumnId: "c2", title: "To do", taskName: "todo"},
      {columnId: "c2", columnType: "work-column", nextColumnId: "c3", title: "Analysis", taskName: "analysis", difficulty: 1},
      {columnId: "c3", columnType: "queue-column", nextColumnId: "c4", title: "", taskName: "analysis"},
      {columnId: "c4", columnType: "work-column", nextColumnId: "c5", title: "Design", taskName: "design", difficulty: 2},
      {columnId: "c5", columnType: "queue-column", nextColumnId: "c6", title: "", taskName: "design"},
      {columnId: "c6", columnType: "work-column", nextColumnId: "c7", title: "Development", taskName: "development", difficulty: 2},
      {columnId: "c7", columnType: "queue-column", nextColumnId: "c8", title: "", taskName: "development"},
      {columnId: "c8", columnType: "work-column", nextColumnId: "c9", title: "QA", taskName: "qa", difficulty: 1},
      {columnId: "c9", columnType: "end-column", title: "Done", taskName: "done"}
    ]
  }
)
module.exports = initialState