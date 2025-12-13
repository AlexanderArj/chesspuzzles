import { findUser, comparePassword, setLoggedInUser } from './authUtils.js';

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');

    if (loginForm) {
        loginForm.addEventListener('submit', (event) => {
            event.preventDefault();

            const identifier = document.getElementById('login-identifier').value.trim();
            const password = document.getElementById('login-password').value.trim();

            if (!identifier || !password) {
                alert("Please enter your username/email and password.");
                return;
            }

            const user = findUser(identifier);

            if (!user) {
                alert("User not found :( .");
                return;
            }

            if (comparePassword(password, user.passwordHash)) {
                setLoggedInUser(user.username); 
                
                alert(`Welcome back, ${user.username}!`);
                
                window.location.href = '/'; 
            } else {
                alert("Sorry, wrong pasword.");
            }
        });
    }
});