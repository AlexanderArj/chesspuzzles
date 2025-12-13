import { initApp } from "./initApp.mjs";
import { logoutUser } from './authUtils.js';

const audio = document.getElementById("audio");
const volumeBtn = document.getElementById("volumeBtn");
const volumeIcon = document.getElementById("volumeIcon");

const modal = document.getElementById("startModal");
const startButton = document.getElementById("startButton");

let isMuted = false;
const vol = 0.2;

function setupVolumeControl() {
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
}

startButton.addEventListener("click", () => {
    audio.volume = vol;
    audio.play();

    modal.classList.add("fade-out");
    setTimeout(() => {
        modal.style.display = "none";
    }, 800);

    initApp();
    setupVolumeControl();
});

document.addEventListener('DOMContentLoaded', () => {
    const authStatusElement = document.getElementById('authStatus');
    const loggedInUser = localStorage.getItem('loggedInUser');

    if (authStatusElement) {
        if (loggedInUser) {
            authStatusElement.innerHTML = `
                <span>Hola, <strong>${loggedInUser}</strong></span>
                <button id="logoutBtn" style="margin-left: 10px; background: none; border: none; color: var(--main-color); cursor: pointer;">
                    (Logout)
                </button>
            `;

            document.getElementById('logoutBtn').addEventListener('click', () => {
                logoutUser();
                alert("Sesión cerrada con éxito.");
                window.location.reload();
            });
        } else {
            authStatusElement.innerHTML = `
                <a href="/login.html">Login</a> | 
                <a href="/registro.html">Registro</a>
            `;
        }
    }
});