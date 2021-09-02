const initialState = () => ({
  columns: [
    {columnId: "c1", nextColumnId: "c2", columnType: "queue-column", title: "To do"},
    {columnId: "c2", nextColumnId: "c3", columnType: "work-column", title: "Analysis"},
    {columnId: "c3", nextColumnId: "c4", columnType: "queue-column", title: "Ready for design"},
    {columnId: "c4", nextColumnId: "c5", columnType: "work-column", title: "Design"},
    {columnId: "c5", nextColumnId: "c6", columnType: "queue-column", title: "Ready for development"},
    {columnId: "c6", nextColumnId: "c7", columnType: "work-column", title: "Development"},
    {columnId: "c7", nextColumnId: "c8", columnType: "queue-column", title: "Ready for QA"},
    {columnId: "c8", nextColumnId: "c9", columnType: "work-column", title: "QA"},
    {columnId: "c9", columnType: "queue-column", title: "Done"}
  ]
}
)
module.exports = initialState