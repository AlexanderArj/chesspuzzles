import { loadUsers, saveUsers, userExists, hashPassword, setLoggedInUser } from './authUtils.js';

document.addEventListener('DOMContentLoaded', () => {
    const registroForm = document.getElementById('registroForm');
    
    if (registroForm) {
        registroForm.addEventListener('submit', (event) => {
            event.preventDefault();

            const username = document.getElementById('username').value.trim();
            const email = document.getElementById('email').value.trim();
            const password = document.getElementById('password').value.trim();

            if (!username || !email || !password) {
                alert("Please complete all checks.");
                return;
            }

            if (userExists(username, email)) {
                alert("Error, this email is already used.");
                return;
            }

            const newUser = {
                id: Date.now(), 
                username: username,
                email: email,
                passwordHash: hashPassword(password), 
                createdAt: new Date().toISOString(),
                
            };

            const users = loadUsers();
            users.push(newUser);
            saveUsers(users);

            setLoggedInUser(username);

            alert(`Success!  ${username}. Welcome!`);
            
            window.location.href = '/'; 
        });
    }
});