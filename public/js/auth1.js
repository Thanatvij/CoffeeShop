// (browser-side JavaScript)
document.addEventListener('DOMContentLoaded', function() {
    const API_URL = 'http://localhost:3000/api';
    
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
                    console.log("Login success response received");
                
                    localStorage.setItem('user', JSON.stringify(data.user));
                
                    showMessage('Login successful! Redirecting...', 'success');
                
                    setTimeout(() => {
                        console.log("Redirecting to index.html");
                        window.location.href = 'index.html';
                    }, 1500);
                } else {
                    console.log("Login failed", data);
                    showMessage(data.message || 'Login failed', 'error');
                }
            } catch (error) {
                showMessage('Connection error. Please try again.', 'error');
            } finally {
                setFormLoading(loginForm, false);
            }
        });
    }
    
    // Helper function to toggle loading state on form
    function setFormLoading(form, isLoading) {
        const submitButton = form.querySelector('button[type="submit"]');
        
        if (isLoading) {
            submitButton.disabled = true;
            submitButton.innerHTML = 'Processing...';
        } else {
            submitButton.disabled = false;
            submitButton.innerHTML = 'Login';
        }
    }
    
    // Check if user is logged in
    function checkAuthStatus() {
        const user = JSON.parse(localStorage.getItem('user') || 'null');
        
        if (user) {
            const authButtons = document.querySelector('.auth-buttons');
            if (authButtons) {
                authButtons.innerHTML = `
                    <span class="user-greeting">Hello, ${user.username}</span>
                    <a href="#" class="auth-btn logout-btn" id="logoutBtn">Logout</a>
                `;
                
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

function showMessage(message, type = 'info') {
    const container = document.getElementById('message-container');
    if (!container) return;

    container.innerHTML = `
        <div class="auth-message ${type}">
            ${message}
        </div>
    `;

    setTimeout(() => {
        container.innerHTML = '';
    }, 3000);
}