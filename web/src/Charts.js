const Cfd = require("./CFD");
const Timer = require("./Timer");

const initialize = (gameId, subscribe) => {
  const $cfd = document.getElementById('cfd');
  if(!$cfd) return;

  const cfd = Cfd($cfd, gameId);
  let timer = undefined

  subscribe('IterationStarted', (event) => {
    cfd.clear()
    cfd.initialize(event);

    timer = Timer(event.duration).start(cfd.update);
  });

  document.addEventListener('IterationFinished', () => timer.stop());
}

module.exports = {initialize}