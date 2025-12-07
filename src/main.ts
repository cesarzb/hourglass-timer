const startButton = document.getElementById("start-button");
const timeLeftText = document.querySelectorAll<HTMLElement>(".time-left-text");
const topSand = document.getElementById("top-sand");
const bottomSand = document.getElementById("bottom-sand");

let intervalId: number | undefined;
let time = 25 * 60;
let timerState: "running" | "idle" | "finished" = "idle";

if (startButton) {
  startButton.onclick = (): void => {
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
        time = 25 * 60;
        progressSand();
        startTimer();
        changeButtonText("Stop Timer");
        break;
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
    progressSand();

    if (timeLeftText) {
      timeLeftText.forEach((element: HTMLElement): void => {
        element.innerText = showTime(time);
      });
    }

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

function progressSand(): void {
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
