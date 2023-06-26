function isMobileDevice() {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

var desktopElements = document.querySelectorAll(".desktop");
var mobileElements = document.querySelectorAll(".mobile");

if (isMobileDevice()) {
  desktopElements.forEach((e) => (e.style.display = "none"));
  mobileElements.forEach((e) => (e.style.display = "block"));
} else {
  desktopElements.forEach((e) => (e.style.display = "block"));
  mobileElements.forEach((e) => (e.style.display = "none"));
}
