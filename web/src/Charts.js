const Cfd = require("./CFD");
const Timer = require("./Timer");

const initialize = (gameId) => {
  const $cfd = document.getElementById('cfd');
  if(!$cfd) return;

  const cfd = Cfd($cfd, gameId);
  let timer = undefined

  const update = (iterationId) => cfd.update(iterationId);

  document.addEventListener('IterationStarted', ({detail}) => {
    cfd.clear()
    cfd.initialize(detail);

    timer = Timer(detail.duration).start(() => update(detail.iterationId));
  });

  document.addEventListener('IterationFinished', ({detail}) => {
    timer.stop();

    const selector = `.show-previous-iteration[data-iteration-id="${detail.iterationId}"]`;
    const previousIterationElements = document.querySelectorAll(selector);
    console.log({selector, previousIterationElements})

    previousIterationElements.forEach(element => {
      element.addEventListener('click', () => update(detail.iterationId))
    });
  });

}

module.exports = {initialize}