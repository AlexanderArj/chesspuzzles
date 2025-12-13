const USERS_STORAGE_KEY = 'chess_puzzles_users';

export function loadUsers() {
    try {
        const usersJson = localStorage.getItem(USERS_STORAGE_KEY);
        return usersJson ? JSON.parse(usersJson) : [];
    } catch (error) {
        console.error("There was an error:", error);
        return []; 
    }
}

export function saveUsers(users) {
    try {
        localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
    } catch (error) {
        console.error("Could not save the data:", error);
    }
}

export function setLoggedInUser(identifier) {
    localStorage.setItem('loggedInUser', identifier);
}

export function logoutUser() {
    localStorage.removeItem('loggedInUser');
}

export function userExists(username, email) {
    const users = loadUsers();
    return users.some(user => user.username.toLowerCase() === username.toLowerCase() || user.email.toLowerCase() === email.toLowerCase());
}

export function findUser(identifier) {
    const users = loadUsers();
    const lowerIdentifier = identifier.toLowerCase();
    return users.find(user => 
        user.username.toLowerCase() === lowerIdentifier || 
        user.email.toLowerCase() === lowerIdentifier
    );
}

export function hashPassword(password) {
    return password.split('').reverse().join('');
}

export function comparePassword(inputPassword, storedHash) {
    return hashPassword(inputPassword) === storedHash;
}