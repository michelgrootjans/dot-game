const Cfd = require("./CFD");
const Timer = require("./Timer");

const initialize = () => {
  const $cfd = document.getElementById('cfd');
  if(!$cfd) return;

  const cfd = Cfd($cfd);
  let timer = undefined

  document.addEventListener('IterationStarted', ({detail}) => {
    cfd.clear()
    cfd.update();

    timer = Timer(detail.duration).start(cfd.update);
  });

  document.addEventListener('IterationFinished', () => timer.stop());
}

module.exports = {initialize}