import chimeUrl from "/chime_sound.wav";
import buttonUrl from "/button_click.wav";

const startButton = document.getElementById("start-button");
const resetToFiveButton = document.getElementById("reset-to-five-button");
const resetToTwentyFiveButton = document.getElementById(
  "reset-to-twenty-five-button",
);
const timeLeftInput =
  document.querySelector<HTMLInputElement>("#time-left-input");
const timeLeftTitle = document.querySelector<HTMLElement>("#time-left-title");
const topSand = document.getElementById("top-sand");
const bottomSand = document.getElementById("bottom-sand");
const defaultCountdownTime = 25 * 60;
const inputFormat = /^\d{1,2}:\d{2}$/;

let intervalId: number | undefined;
let time = defaultCountdownTime;

let timerState: "running" | "idle" | "finished" = "idle";
if (localStorage.getItem("timeLeft")) {
  time = Number(localStorage.getItem("timeLeft"));
}

let startingCountdownTime = time;

progressFeedback();

if (startButton) {
  startButton.onclick = (): void => {
    playAudio("button");
    if (Notification.permission !== "granted") {
      requestNotificationPermission();
    }
    switch (timerState) {
      case "idle":
        startTimer();
        changeButtonText("Stop Timer");
        break;
      case "running":
        stopTimer();
        changeButtonText("Start Timer");
        break;
      case "finished":
        time = startingCountdownTime;
        saveTimeToStorage(time);
        progressFeedback();
        startTimer();
        changeButtonText("Stop Timer");
        break;
    }
  };
}

// TODO: make shared class for both buttons, and store time in data attributes
if (resetToFiveButton) {
  resetToFiveButton.onclick = (): void => {
    playAudio("button");
    stopTimer();
    time = 5 * 60;
    saveTimeToStorage(time);
    changeButtonText("Start Timer");
    progressFeedback();
  };
}

if (resetToTwentyFiveButton) {
  resetToTwentyFiveButton.onclick = (): void => {
    playAudio("button");
    stopTimer();
    time = 25 * 60;
    saveTimeToStorage(time);
    changeButtonText("Start Timer");
    progressFeedback();
  };
}

if (timeLeftInput) {
  timeLeftInput.onchange = (): void => {
    if (inputFormat.test(timeLeftInput.value)) {
      timeLeftInput.classList.remove("text-red-900");
      timeLeftInput.classList.add("text-white");

      const [minutes, seconds] = timeLeftInput.value.split(":");
      startingCountdownTime = Number(minutes) * 60 + Number(seconds);
      time = startingCountdownTime;
    } else {
      timeLeftInput.classList.remove("text-white");
      timeLeftInput.classList.add("text-red-900");
      time = defaultCountdownTime;
    }
  };
}

function showTime(time: number): string {
  const minutes = Math.floor(time / 60);
  const seconds = time % 60;
  const secondsForDisplay = seconds.toString().padStart(2, "0");

  return `${minutes}:${secondsForDisplay}`;
}

function startTimer(): void {
  intervalId = window.setInterval((): void => {
    time -= 1;
    saveTimeToStorage(time);
    progressFeedback();

    if (time == 0) {
      window.clearInterval(intervalId);
      timerState = "finished";
      changeButtonText("Restart Timer");
      intervalId = undefined;
      notifyAboutFinish();
    }
  }, 1000);

  timerState = "running";
}

function stopTimer(): void {
  window.clearInterval(intervalId);
  timerState = "idle";
}

function changeButtonText(content: string): void {
  if (startButton) {
    startButton.innerText = content;
  }
}

function progressFeedback(): void {
  if (timeLeftTitle) {
    timeLeftTitle.innerText = showTime(time);
  }

  if (timeLeftInput) {
    timeLeftInput.value = showTime(time);
  }

  if (topSand && bottomSand) {
    topSand.style.height = `${time / 15}px`;
    bottomSand.style.height = `${100 - time / 15}px`;
  }
}

function notifyAboutFinish(): void {
  if (!("Notification" in window)) {
    alert("This browser doesn't support notifications!");
  } else if (Notification.permission == "granted") {
    new Notification("Hourglass finished!");
  } else if (Notification.permission !== "denied") {
    requestNotificationPermission("Hourglass finished!");
  }

  playAudio("chime");
}

function requestNotificationPermission(notificationText?: string) {
  if (Notification.permission !== "denied") {
    Notification.requestPermission().then((): void => {
      if (notificationText) {
        new Notification(notificationText);
      }
    });
  }
}

function saveTimeToStorage(value: number) {
  console.log("Saved to storage");
  localStorage.setItem("timeLeft", String(value));
}

const playAudio = (type: string): void => {
  let soundPath = "";
  let volume = 1.0;
  switch (type) {
    case "chime":
      soundPath = chimeUrl;
      volume = 0.7;
      break;
    case "button":
      soundPath = buttonUrl;
      volume = 0.2;
      break;
  }

  const notificationSound = new Audio(soundPath);
  notificationSound.volume = volume;
  notificationSound.play().catch((error) => {
    console.error("Autoplay blocked:", error);
  });
};
