"use strict";

let deferredInstallPrompt = null;
const installButton = document.getElementById("install-button");
installButton.addEventListener("click", installPWA);

// Add event listener for beforeinstallprompt event
window.addEventListener("beforeinstallprompt", saveBeforeInstallPromptEvent);

// Event handler for beforeinstallprompt event.
// Saves the event & shows install button.
function saveBeforeInstallPromptEvent(evt) {
  deferredInstallPrompt = evt;
  installButton.removeAttribute("hidden");
}

// Event handler for butInstall - Does the PWA installation.
function installPWA(evt) {
  deferredInstallPrompt.prompt();
  evt.srcElement.setAttribute("hidden", true);
}

// Add event listener for appinstalled event
window.addEventListener("appinstalled", logAppInstalled);

// Event handler for appinstalled event.
// Log the installation to analytics or save the event somehow.
function logAppInstalled(evt) {
  deferredInstallPrompt.userChoice.then((choice) => {
    if (choice.outcome === "accepted") {
      console.log("User accepted the A2HS prompt", choice);
    } else {
      console.log("User dismissed the A2HS prompt", choice);
    }
    deferredInstallPrompt = null;
  });
}
