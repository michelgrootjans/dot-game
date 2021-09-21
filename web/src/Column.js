const Card = require("./Card");

const initialize = (susbcribe) => {
  const columns = Array.from(document.querySelectorAll('[data-column-id]'))
    .reduce((map, item) => {
      map[item.dataset.columnId] = item.querySelector('.tasks');
      return map;
    }, {})

  susbcribe('TaskCreated', (event) => {
    columns[event.column.columnId]?.append(Card.create(event));
  });

  susbcribe('TaskMoved', (event) => {
    const nextColumn = columns[event.to.columnId];

    if (nextColumn) {
      nextColumn.append(Card.findOrCreate(event));
    } else {
      Card.remove(event)
    }
  });
};

module.exports = {
  initialize
};