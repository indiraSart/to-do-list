// API URL
const API_URL = 'http://localhost:4000/api';

// Test server connection
async function testConnection() {
    try {
        const response = await fetch(`${API_URL}/test`);
        const data = await response.json();
        console.log('Server connection test:', data.message);
        return true;
    } catch (error) {
        console.error('Server connection error:', error);
        return false;
    }
}

AudioParamMap
// DOM Elements
const authButtons = document.getElementById('authButtons');
const userInfo = document.getElementById('userInfo');
const welcomeMessage = document.getElementById('welcomeMessage');
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const todolistManagement = document.getElementById('todolistManagement');
const todoList = document.getElementById('todoList');
const addTaskForm = document.getElementById('addTaskForm');

// Check if user is logged in
function checkAuth() {
    const token = localStorage.getItem('token');
    if (token) {
        authButtons.classList.add('d-none');
        userInfo.classList.remove('d-none');
        todolistManagement.classList.remove('d-none');
        const username = localStorage.getItem('username');
        welcomeMessage.textContent = `Welcome, ${username}!`;
        fetchTask();
    } else {
        authButtons.classList.remove('d-none');
        userInfo.classList.add('d-none');
        todolistManagement.classList.add('d-none');
    }
}

// Show/Hide Forms
function showLoginForm() {
    loginForm.classList.remove('d-none');
    registerForm.classList.add('d-none');
}

function showRegisterForm() {
    registerForm.classList.remove('d-none');
    loginForm.classList.add('d-none');
}

function showAddTaskForm() {
    addTaskForm.classList.toggle('d-none');
}

// Auth Functions
async function register(event) {
    event.preventDefault();
    
    if (!(await testConnection())) {
        alert('Cannot connect to server. Please make sure the server is running.');
        return;
    }

    const username = document.getElementById('registerUsername').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;

    try {
        const response = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, email, password })
        });

        const data = await response.json();
        if (response.ok) {
            localStorage.setItem('token', data.token);
            localStorage.setItem('username', data.user.username);
            checkAuth();
            registerForm.classList.add('d-none');
            alert('Registration successful! Welcome to to-do-list Registry.');
        } else {
            alert(data.message || 'Registration failed. Please try again.');
        }
    } catch (error) {
        console.error('Registration error:', error);
        alert('Error connecting to the server. Please make sure the server is running.');
    }
}

async function login(event) {
    event.preventDefault();

    if (!(await testConnection())) {
        alert('Cannot connect to server. Please make sure the server is running.');
        return;
    }

    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    try {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();
        
        if (response.ok) {
            localStorage.setItem('token', data.token);
            localStorage.setItem('username', data.user.username);
            checkAuth();
            loginForm.classList.add('d-none');
            alert('Login successful! Welcome back.');
        } else {
            if (data.errors) {
                const errorMessages = data.errors.map(error => error.msg).join('\n');
                alert(`Login failed:\n${errorMessages}`);
            } else {
                alert(data.message || 'Login failed. Please check your credentials.');
            }
        }
    } catch (error) {
        console.error('Login error:', error);
        alert('Error connecting to the server. Please make sure the server is running.');
    }
}

function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    checkAuth();
}

async function addTask(event) {
    event.preventDefault();
    const reindeerData = {
        tittle: document.getElementById('Tittle').value,
        date: parseInt(document.getElementById('date').value),
        description: document.getElementById('taskDescription').value
    };

    try {
        const response = await fetch(`${API_URL}/task`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify(todoListData)
        });

        if (response.ok) {
            event.target.reset();
            addTaskForm.classList.add('d-none');
            fetchTask();
        } else {
            const data = await response.json();
            alert(data.message || 'Error adding task');
        }
    } catch (error) {
        alert('Error adding task');
    }
}

async function deleteTask(id) {
    if (!confirm('Are you sure you want to delete this task?')) return;

    try {
        const response = await fetch(`${API_URL}/task/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });

        const data = await response.json();
        
        if (response.ok) {
            fetchTask();
            // Show success message
            alert('task successfully deleted');
        } else {
            alert(data.message || 'Error deleting task');
        }
    } catch (error) {
        console.error('Delete error:', error);
        alert('Error deleting task. Please try again.');
    }
}

checkAuth(); 