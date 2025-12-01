import { initApp } from "./initApp.mjs";

const audio = document.getElementById("audio");
const volumeBtn = document.getElementById("volumeBtn");
const volumeIcon = document.getElementById("volumeIcon");

const modal = document.getElementById("startModal");
const startButton = document.getElementById("startButton");

let isMuted = false;
const vol = 0.2;

startButton.addEventListener("click", () => {
  audio.volume = vol;
  audio.play();

  modal.classList.add("fade-out");

  setTimeout(() => { modal.style.display = "none";}, 800);

  initApp();

  volumeBtn.addEventListener('click', () => {
  if (isMuted) {
    audio.muted = false;
    isMuted = false;
    volumeIcon.src = "images/volume.svg";
  } else {
    audio.muted = true;
    isMuted = true;
    volumeIcon.src = "images/volume-mute.svg";
  }
});

});


