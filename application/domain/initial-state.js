const initialState = () => ({
    columns: [
      {columnId: "c1", columnType: "queue-column", nextColumnId: "c2", title: "To do", taskName: "todo"},
      {columnId: "c2", columnType: "work-column", nextColumnId: "c3", title: "Analysis", taskName: "analysis"},
      {columnId: "c3", columnType: "queue-column", nextColumnId: "c4", title: "Ready for design", taskName: "analysis"},
      {columnId: "c4", columnType: "work-column", nextColumnId: "c5", title: "Design", taskName: "design"},
      {columnId: "c5", columnType: "queue-column", nextColumnId: "c6", title: "Ready for development", taskName: "design"},
      {columnId: "c6", columnType: "work-column", nextColumnId: "c7", title: "Development", taskName: "development"},
      {columnId: "c7", columnType: "queue-column", nextColumnId: "c8", title: "Ready for QA", taskName: "development"},
      {columnId: "c8", columnType: "work-column", nextColumnId: "c9", title: "QA", taskName: "qa"},
      {columnId: "c9", columnType: "queue-column", title: "Done", taskName: "done"}
    ]
  }
)
module.exports = initialState