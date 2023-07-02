const soundButton = document.getElementById("sound-button");
const difficultButton = document.getElementById("difficult-button");
const statsOpenButton = document.getElementById("stats-button");
// const statsCloseButton = document.getElementById("stats-close-button");
const difficultAlert = document.getElementById("difficult-alert");
const statsAlert = document.getElementById("stats-alert");

const iconSoundOn =
  '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-volume-2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg>';
const iconSoundOff =
  '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-volume-x"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><line x1="23" y1="9" x2="17" y2="15"></line><line x1="17" y1="9" x2="23" y2="15"></line></svg>';
const iconsDifficult = [
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path d="M10,9v2a1,1,0,0,1-2,0V9a1,1,0,0,1,2,0Zm5-1a1,1,0,0,0-1,1v2a1,1,0,0,0,2,0V9A1,1,0,0,0,15,8Zm8,4A11,11,0,1,1,12,1,11.013,11.013,0,0,1,23,12Zm-2,0a9,9,0,1,0-9,9A9.01,9.01,0,0,0,21,12Z"/></svg>',
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path d="M12,1A11,11,0,1,0,23,12,11.013,11.013,0,0,0,12,1Zm0,20a9,9,0,1,1,9-9A9.011,9.011,0,0,1,12,21Zm6-8A6,6,0,0,1,6,13a1,1,0,0,1,2,0,4,4,0,0,0,8,0,1,1,0,0,1,2,0ZM8,10V9a1,1,0,0,1,2,0v1a1,1,0,0,1-2,0Zm6,0V9a1,1,0,0,1,2,0v1a1,1,0,0,1-2,0Z"/></svg>',
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path d="M7.105,9.553a1,1,0,0,1,1.342-.448l2,1a1,1,0,0,1-.894,1.79l-2-1A1,1,0,0,1,7.105,9.553Zm8.448-.448-2,1a1,1,0,0,0,.894,1.79l2-1a1,1,0,1,0-.894-1.79Zm-.328,5.263a4,4,0,0,1-6.45,0,1,1,0,0,0-1.55,1.264,6,6,0,0,0,9.55,0,1,1,0,1,0-1.55-1.264ZM23,2V12A11,11,0,0,1,1,12V2a1,1,0,0,1,1.316-.949l4.229,1.41a10.914,10.914,0,0,1,10.91,0l4.229-1.41A1,1,0,0,1,23,2ZM21,12a9,9,0,1,0-9,9A9.029,9.029,0,0,0,21,12Z"/></svg>',
];
const iconsDifficultAlert = [
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#22bb33"><path d="M10,9v2a1,1,0,0,1-2,0V9a1,1,0,0,1,2,0Zm5-1a1,1,0,0,0-1,1v2a1,1,0,0,0,2,0V9A1,1,0,0,0,15,8Zm8,4A11,11,0,1,1,12,1,11.013,11.013,0,0,1,23,12Zm-2,0a9,9,0,1,0-9,9A9.01,9.01,0,0,0,21,12Z"/></svg><span class="text-xl">Easy Mode</span>',
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#f0ad4e"><path d="M12,1A11,11,0,1,0,23,12,11.013,11.013,0,0,0,12,1Zm0,20a9,9,0,1,1,9-9A9.011,9.011,0,0,1,12,21Zm6-8A6,6,0,0,1,6,13a1,1,0,0,1,2,0,4,4,0,0,0,8,0,1,1,0,0,1,2,0ZM8,10V9a1,1,0,0,1,2,0v1a1,1,0,0,1-2,0Zm6,0V9a1,1,0,0,1,2,0v1a1,1,0,0,1-2,0Z"/></svg><span class="text-xl">Medium Mode</span>',
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#bb2124"><path d="M7.105,9.553a1,1,0,0,1,1.342-.448l2,1a1,1,0,0,1-.894,1.79l-2-1A1,1,0,0,1,7.105,9.553Zm8.448-.448-2,1a1,1,0,0,0,.894,1.79l2-1a1,1,0,1,0-.894-1.79Zm-.328,5.263a4,4,0,0,1-6.45,0,1,1,0,0,0-1.55,1.264,6,6,0,0,0,9.55,0,1,1,0,1,0-1.55-1.264ZM23,2V12A11,11,0,0,1,1,12V2a1,1,0,0,1,1.316-.949l4.229,1.41a10.914,10.914,0,0,1,10.91,0l4.229-1.41A1,1,0,0,1,23,2ZM21,12a9,9,0,1,0-9,9A9.029,9.029,0,0,0,21,12Z"/></svg><span class="text-xl">Hard Mode</span>',
];

window.onload = () => {
  const isSoundOff = (localStorage.getItem(KEYS.isSoundOff) || "false") === "true";
  const currentDL = Number(localStorage.getItem(KEYS.difficultLevel)) || 1;
  soundButton.innerHTML = isSoundOff ? iconSoundOff : iconSoundOn;
  difficultButton.innerHTML = iconsDifficult[currentDL - 1];
};

soundButton.addEventListener("click", () => {
  const isSoundOff = (localStorage.getItem(KEYS.isSoundOff) || "false") === "true";
  if (isSoundOff) {
    localStorage.setItem(KEYS.isSoundOff, false);
    soundButton.innerHTML = iconSoundOn;
    new Audio(SOUNDS.click).play();
  } else {
    localStorage.setItem(KEYS.isSoundOff, true);
    soundButton.innerHTML = iconSoundOff;
  }
});

difficultButton.addEventListener("click", () => {
  playSound(SOUNDS.click);
  let currentDL = Number(localStorage.getItem(KEYS.difficultLevel)) || 1;

  difficultButton.innerHTML = iconsDifficult[currentDL % 3];
  difficultAlert.innerHTML = iconsDifficultAlert[currentDL % 3];
  difficultAlert.classList.remove("hidden");
  setTimeout(() => {
    if (!difficultAlert.classList.contains("hidden")) difficultAlert.classList.add("hidden");
  }, 1500);

  currentDL = (currentDL % 3) + 1;

  localStorage.setItem(KEYS.difficultLevel, currentDL);
});

statsOpenButton.addEventListener("click", () => {
  playSound(SOUNDS.click);
  statsAlert.classList.remove("hidden");

  const stats = JSON.parse(localStorage.getItem(KEYS.stats)) || {
    easy: {
      highScore: 0,
      attempt: 0,
      totalScore: 0,
    },
    medium: {
      highScore: 0,
      attempt: 0,
      totalScore: 0,
    },
    hard: {
      highScore: 0,
      attempt: 0,
      totalScore: 0,
    },
  };

  statsAlert.innerHTML = `
    <span class="text-xl">Your stats</span>
    <span>
      <label class="text-lg">Easy mode</label>
      <ul>
        <li>High score: ${stats.easy.highScore}</li>
        <li>Attempt: ${stats.easy.attempt}</li>
        <li>Avg score: ${Math.round(stats.easy.totalScore / stats.easy.attempt)}</li>
      </ul>
    </span>
    <span>
      <label class="text-lg">Medium mode</label>
      <ul>
        <li>High score: ${stats.medium.highScore}</li>
        <li>Attempt: ${stats.medium.attempt}</li>
        <li>Avg score: ${Math.round(stats.medium.totalScore / stats.medium.attempt)}</li>
      </ul>
    </span>
    <span>
      <label class="text-lg">Hard mode</label>
      <ul>
        <li>High score: ${stats.hard.highScore}</li>
        <li>Attempt: ${stats.hard.attempt}</li>
        <li>Avg score: ${Math.round(stats.hard.totalScore / stats.hard.attempt)}</li>
      </ul>
    </span>
  `;
});

statsAlert.addEventListener("click", (e) => {
  playSound(SOUNDS.click);
  if (!statsAlert.classList.contains("hidden")) statsAlert.classList.add("hidden");
});

statsOpenButton.addEventListener("mousedown", (e) => e.preventDefault());
difficultButton.addEventListener("mousedown", (e) => e.preventDefault());
soundButton.addEventListener("mousedown", (e) => e.preventDefault());
