const Cfd = require("./CFD");
const Timer = require("./Timer");

const setCurrentIteration = (iterationId) => {
  document.querySelectorAll('.iteration.current')
    .forEach(element => element.classList.remove('current'))
  document.querySelectorAll(`.iteration[data-iteration-id="${iterationId}"]`)
    .forEach(element => element.classList.add('current'));
};

const initialize = (gameId) => {
  const $cfd = document.getElementById('cfd');
  if (!$cfd) return;

  const cfd = Cfd($cfd, gameId);
  let timer = undefined

  const update = (iterationId) => cfd.update(iterationId);

  document.addEventListener('IterationStarted', ({detail}) => {
    cfd.clear()
    cfd.initialize(detail);

    timer = Timer(detail.duration).start(() => update(detail.iterationId));
    setCurrentIteration(detail.iterationId);
  });

  document.addEventListener('IterationFinished', ({detail}) => {
    timer.stop();

    const iterationId = detail.iterationId;

    document.querySelectorAll(`.show-previous-iteration[data-iteration-id="${iterationId}"]`)
      .forEach(element => {
        element.addEventListener('click', () => {
          update(iterationId)
            .then(() => {
              setCurrentIteration(iterationId);
            });
        })
      });
  });

}

module.exports = {initialize}