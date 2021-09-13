const Timer = require("./Timer");

const initialize = () => {

  const progressBar = document.getElementById("progressbar");
  if(!progressBar) return;

  document.addEventListener('IterationStarted', ({detail}) => {
    const duration = detail.duration;
    progressBar.max = `${duration}`;
    Timer(duration).start(time => progressBar.value = time);
  });
};

module.exports = {initialize};
