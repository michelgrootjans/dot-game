const Timer = require("./Timer");

const initialize = (subscribe) => {

  const progressBar = document.getElementById("progressbar");
  if(!progressBar) return;

  let timer = undefined;

  subscribe('IterationStarted', (event) => {
    const duration = event.duration;
    const startTime = event.startTime;
    progressBar.max = `${duration}`;
    timer = Timer(duration).start(() => progressBar.value = Date.now() - startTime);
  });

  subscribe('IterationFinished', () => timer.stop());
};

module.exports = {initialize};
