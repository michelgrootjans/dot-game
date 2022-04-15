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

  document.addEventListener('IterationFinished', () => timer.stop());
}

module.exports = {initialize, update}