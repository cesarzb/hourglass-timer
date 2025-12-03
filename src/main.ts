const startButton = document.getElementById("start-button");
const timeLeftText = document.querySelectorAll<HTMLElement>(".time-left-text");

let intervalId: number | undefined;
let time = 25 * 60;
let timerState: "running" | "idle" | "finished" = "idle";

if (startButton) {
  startButton.onclick = (): void => {
    switch (timerState) {
      case "idle":
        startTimer();
        break;
      case "running":
        stopTimer();
        break;
      case "finished":
        time = 25 * 60;
        startTimer();
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
  if (intervalId && timerState === "running") return;

  intervalId = window.setInterval(() => {
    time -= 1;

    if (timeLeftText) {
      timeLeftText.forEach((element: HTMLElement): void => {
        element.innerText = showTime(time);
      });
    }

    if (time == 0) {
      window.clearInterval(intervalId);
      timerState = "finished";
      intervalId = undefined;
    }
  }, 1000);

  timerState = "running";
}

function stopTimer(): void {
  window.clearInterval(intervalId);
  timerState = "idle";
}
