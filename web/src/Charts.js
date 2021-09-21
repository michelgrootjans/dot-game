const Cfd = require("./CFD");
const Timer = require("./Timer");

const initialize = (gameId) => {
  const $cfd = document.getElementById('cfd');
  if(!$cfd) return;

  const cfd = Cfd($cfd, gameId);
  let timer = undefined

  document.addEventListener('IterationStarted', ({detail}) => {
    cfd.clear()
    cfd.initialize(detail);

    timer = Timer(detail.duration).start(cfd.update);
  });

  document.addEventListener('IterationFinished', () => timer.stop());
}

module.exports = {initialize}