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
