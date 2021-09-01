const initialState = () => ({
  columns: [
    {columnId: "c1", nextColumnId: "c2", title: "To do"},
    {columnId: "c2", nextColumnId: "c3", title: "Analysis"},
    {columnId: "c3", nextColumnId: "c4", title: "Ready for design"},
    {columnId: "c4", nextColumnId: "c5", title: "Design"},
    {columnId: "c5", nextColumnId: "c6", title: "Reday for development"},
    {columnId: "c6", nextColumnId: "c7", title: "Development"},
    {columnId: "c7", nextColumnId: "c8", title: "Ready for QA"},
    {columnId: "c8", nextColumnId: "c9", title: "QA"},
    {columnId: "c9", title: "Done"}
  ]
}
)
module.exports = initialState