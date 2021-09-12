const Card = require("./Card");

const initialize = () => {
  const columns = Array.from(document.querySelectorAll('[data-column-id]'))
    .reduce((map, item) => {
      map[item.dataset.columnId] = item.querySelector('.tasks');
      return map;
    }, {})

  document.addEventListener('TaskCreated', ({detail}) => {
    const card = Card.create(detail);
    columns[detail.column.columnId].append(card);
  });

  document.addEventListener('TaskMoved', ({detail}) => {
    const nextColumn = columns[detail.to.columnId];

    if (nextColumn) {
      nextColumn.append(Card.findOrCreate(detail));
    } else {
      Card.remove(detail)
    }
  });
};

module.exports = {
  initialize
};