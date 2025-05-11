document.addEventListener('DOMContentLoaded', function() {
    const API_URL = 'http://localhost:3000/api';
    
    // Login form handling
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            
            // Disable form during submission
            setFormLoading(loginForm, true);
            
            try {
                const response = await fetch(`${API_URL}/login`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ username, password })
                });
                
                const data = await response.json();
                
                if (response.ok) {
                    // Save user data in localStorage or sessionStorage
                    localStorage.setItem('user', JSON.stringify(data.user));
                    
                    // Show success message
                    showMessage('Login successful! Redirecting...', 'success');
                    
                    // Redirect to home page after a short delay
                    setTimeout(() => {
                        window.location.href = 'index.html';
                    }, 1500);
                } else {
                    // Show error message
                    showMessage(data.message || 'Login failed', 'error');
                }
            } catch (error) {
                console.error('Login error:', error);
                showMessage('Connection error. Please try again.', 'error');
            } finally {
                setFormLoading(loginForm, false);
            }
        });
    }
    
    // Registration form handling
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const fullName = document.getElementById('fullname').value;
            const email = document.getElementById('email').value;
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirm-password').value;
            
            // Basic validation
            if (password !== confirmPassword) {
                showMessage('Passwords do not match', 'error');
                return;
            }
            
            // Disable form during submission
            setFormLoading(registerForm, true);
            
            try {
                const response = await fetch(`${API_URL}/register`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ fullName, email, username, password })
                });
                
                const data = await response.json();
                
                if (response.ok) {
                    // Show success message
                    showMessage('Registration successful! Redirecting to login...', 'success');
                    
                    // Redirect to login page after a short delay
                    setTimeout(() => {
                        window.location.href = 'login.html';
                    }, 1500);
                } else {
                    // Show error message
                    showMessage(data.message || 'Registration failed', 'error');
                }
            } catch (error) {
                console.error('Registration error:', error);
                showMessage('Connection error. Please try again.', 'error');
            } finally {
                setFormLoading(registerForm, false);
            }
        });
    }
    
    // Helper function to show messages
    function showMessage(message, type) {
        // Create message container if it doesn't exist
        let messageContainer = document.querySelector('.auth-message');
        if (!messageContainer) {
            messageContainer = document.createElement('div');
            messageContainer.className = 'auth-message';
            
            // Find where to insert the message
            const formContainer = document.querySelector('.auth-form-container');
            const form = document.querySelector('.auth-form');
            
            if (formContainer && form) {
                formContainer.insertBefore(messageContainer, form);
            }
        }
        
        // Set message content and style
        messageContainer.textContent = message;
        messageContainer.className = `auth-message ${type}`;
        
        // Auto-remove message after 5 seconds
        setTimeout(() => {
            messageContainer.remove();
        }, 5000);
    }
    
    // Helper function to toggle loading state on form
    function setFormLoading(form, isLoading) {
        const submitButton = form.querySelector('button[type="submit"]');
        
        if (isLoading) {
            submitButton.disabled = true;
            submitButton.innerHTML = 'Processing...';
        } else {
            submitButton.disabled = false;
            submitButton.innerHTML = form.id === 'loginForm' ? 'Login' : 'Create Account';
        }
    }
    
    // Check if user is logged in
    function checkAuthStatus() {
        const user = JSON.parse(localStorage.getItem('user') || 'null');
        
        if (user) {
            // Update UI for logged-in user
            const authButtons = document.querySelector('.auth-buttons');
            if (authButtons) {
                authButtons.innerHTML = `
                    <span class="user-greeting">Hello, ${user.username}</span>
                    <a href="#" class="auth-btn logout-btn" id="logoutBtn">Logout</a>
                `;
                
                // Add logout functionality
                document.getElementById('logoutBtn').addEventListener('click', (e) => {
                    e.preventDefault();
                    localStorage.removeItem('user');
                    window.location.reload();
                });
            }
        }
    }
    
    checkAuthStatus();
});