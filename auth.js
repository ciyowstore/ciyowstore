// Simulated user database using localStorage
const getUsers = () => {
    const users = localStorage.getItem('users');
    return users ? JSON.parse(users) : [];
};

const saveUsers = (users) => {
    localStorage.setItem('users', JSON.stringify(users));
};

// Authentication state
let currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;

// Update UI based on auth state
const updateAuthUI = () => {
    const authButtons = document.getElementById('authButtons');
    const userMenu = document.getElementById('userMenu');
    const currentUserSpan = document.getElementById('currentUser');

    if (currentUser) {
        authButtons.classList.add('hidden');
        userMenu.classList.remove('hidden');
        currentUserSpan.textContent = currentUser.name;
    } else {
        authButtons.classList.remove('hidden');
        userMenu.classList.add('hidden');
        currentUserSpan.textContent = '';
    }
};

// Modal functions
const openModal = (modalId) => {
    document.getElementById(modalId).style.display = 'block';
};

const closeModal = (modalId) => {
    document.getElementById(modalId).style.display = 'none';
};

// Close modal when clicking outside
window.onclick = (event) => {
    if (event.target.classList.contains('modal')) {
        event.target.style.display = 'none';
    }
};

// Sign up function
const signup = (event) => {
    event.preventDefault();
    
    const name = document.getElementById('signupName').value;
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;

    const users = getUsers();
    
    // Check if user already exists
    if (users.find(user => user.email === email)) {
        alert('Email already registered');
        return;
    }

    // Create new user
    const newUser = {
        id: Date.now(),
        name,
        email,
        password, // In a real app, this should be hashed
        orders: []
    };

    users.push(newUser);
    saveUsers(users);

    // Log in the new user
    currentUser = newUser;
    localStorage.setItem('currentUser', JSON.stringify(currentUser));

    // Update UI
    updateAuthUI();
    closeModal('signupModal');
    showNotification('Account created successfully!');

    // Clear form
    document.getElementById('signupForm').reset();
};

// Login function
const login = (event) => {
    event.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    const users = getUsers();
    const user = users.find(u => u.email === email && u.password === password);

    if (user) {
        currentUser = user;
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        updateAuthUI();
        closeModal('loginModal');
        showNotification('Logged in successfully!');
        document.getElementById('loginForm').reset();
    } else {
        alert('Invalid email or password');
    }
};

// Logout function
const logout = () => {
    currentUser = null;
    localStorage.removeItem('currentUser');
    updateAuthUI();
    showNotification('Logged out successfully!');
};

// Initialize auth state
document.addEventListener('DOMContentLoaded', () => {
    updateAuthUI();
}); 