const isInDeployMode = () => {
  const currentURL = window.location.href;
  if (
    currentURL.includes("localhost") ||
    currentURL.startsWith("http://192.168.") ||
    currentURL.startsWith("http://127.0.0.1:")
  )
    return false;
  return true;
};

const toStandardPath = (path) => {
  if (isInDeployMode()) return "Stop-N-Stack/" + path;
  return path;
};

const playSound = (path, volume = 1) => {
  const isSoundOff = (localStorage.getItem(KEYS.isSoundOff) || "false") === "true";
  if (!isSoundOff) {
    const sound = new Audio(path);
    sound.volume = volume;
    sound.play();
  }
};
