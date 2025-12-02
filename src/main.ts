const startButton = document.getElementById("start-button");

let intervalId: number | undefined;
let time = 25; /* * 60; */

startButton.onclick = (): void => {
  console.log("click happened");
  startTimer();
};

function startTimer(): void {
  console.log("function happened");
  if (intervalId) return;

  intervalId = window.setInterval(() => {
    time -= 1;
    console.log(time);

    if (time == 0) {
      window.clearInterval(intervalId);
      intervalId = undefined;
    }
  }, 1000);
}
