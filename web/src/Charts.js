const Cfd = require("./CFD");
const Timer = require("./Timer");

const initialize = () => {
  const $cfd = document.getElementById('cfd');
  if(!$cfd) return;

  const cfd = Cfd($cfd);

  document.addEventListener('IterationStarted', ({detail}) => {
    cfd.clear()
    cfd.update();
    Timer(detail.duration).start(cfd.update);
  });

  document.addEventListener('IterationFinished', cfd.update)
}

module.exports = {initialize}