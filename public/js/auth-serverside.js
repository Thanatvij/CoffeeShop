document.addEventListener('DOMContentLoaded', function() {
  const API_URL = 'http://localhost:5500/api';

  // Simple message display function
  function showMessage(message, type = 'info') {
    // Remove any existing messages
    const existing = document.querySelector('.message');
    if (existing) existing.remove();

    // Create new message element
    const msg = document.createElement('div');
    msg.className = `message ${type}`;
    msg.textContent = message;
    
    // Style the message
    msg.style.cssText = `
      padding: 15px;
      margin: 15px 0;
      border-radius: 5px;
      text-align: center;
      font-weight: 500;
      ${type === 'error' ? 
        'background: #fee; color: #c33; border: 1px solid #fcc;' :
        'background: #efe; color: #363; border: 1px solid #cfc;'
      }
    `;

    // Insert message into page
    const form = document.querySelector('form');
    if (form) {
      form.parentNode.insertBefore(msg, form);
    } else {
      document.body.appendChild(msg);
    }

    // Auto remove after 5 seconds
    setTimeout(() => msg.remove(), 5000);
  }

  // Button loading state
  function setLoading(button, isLoading) {
    button.disabled = isLoading;
    button.textContent = isLoading ? 'Processing...' : button.dataset.originalText;
  }

  // Check if server is running
  async function checkServer() {
    try {
      const response = await fetch(`${API_URL}/health`);
      if (response.ok) {
        console.log('✅ Server is running');
        return true;
      }
    } catch (error) {
      console.error('❌ Server is not running:', error);
      showMessage('Server is not running. Please start the server first.', 'error');
      return false;
    }
  }

  // Update UI based on authentication status
  function updateAuthUI(user = null) {
    const authButtons = document.querySelector('.auth-buttons');
    if (!authButtons) return;

    if (user) {
      authButtons.innerHTML = `
        <span class="user-greeting">Welcome, ${user.username || user.fullName}!</span>
        <a href="user.html" class="user-icon" title="Profile">👤</a>
        <button onclick="logout()" class="logout-btn">Logout</button>
      `;
    } else {
      authButtons.innerHTML = `
        <a href="login.html" class="auth-btn login-btn">Login</a>
        <a href="register.html" class="auth-btn register-btn">Register</a>
      `;
    }
  }

  // Check authentication status
  async function checkAuth() {
    try {
      const response = await fetch(`${API_URL}/me`, {
        credentials: 'include'
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.loggedIn) {
          updateAuthUI(data.user);
          return data.user;
        }
      }
    } catch (error) {
      console.log('Auth check failed:', error);
    }
    
    updateAuthUI(null);
    return null;
  }

  // Logout function
  async function logout() {
    try {
      await fetch(`${API_URL}/logout`, {
        method: 'POST',
        credentials: 'include'
      });
      showMessage('Logged out successfully!', 'success');
      updateAuthUI(null);
      
      // Redirect to home if on user page
      if (window.location.pathname.includes('user.html')) {
        setTimeout(() => window.location.href = 'index.html', 1000);
      }
    } catch (error) {
      console.error('Logout error:', error);
    }
  }

  // Login form handler
  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    const submitBtn = loginForm.querySelector('button[type="submit"]');
    submitBtn.dataset.originalText = submitBtn.textContent;

    loginForm.addEventListener('submit', async function(e) {
      e.preventDefault();
      
      const email = document.getElementById('email')?.value || document.getElementById('username')?.value;
      const password = document.getElementById('password')?.value;
      
      if (!email || !password) {
        return showMessage('Please fill in all fields', 'error');
      }

      // Check server first
      if (!(await checkServer())) return;

      setLoading(submitBtn, true);
      
      try {
        const response = await fetch(`${API_URL}/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ email, password })
        });
        
        const data = await response.json();

        if (response.ok) {
          showMessage('Login successful! Redirecting...', 'success');
          updateAuthUI(data.user);
          setTimeout(() => window.location.href = 'index.html', 1500);
        } else {
          showMessage(data.message || 'Login failed', 'error');
        }
      } catch (error) {
        console.error('Login error:', error);
        showMessage('Connection error. Make sure the server is running.', 'error');
      } finally {
        setLoading(submitBtn, false);
      }
    });
  }

  // Register form handler
  const registerForm = document.getElementById('registerForm');
  if (registerForm) {
    const submitBtn = registerForm.querySelector('button[type="submit"]');
    submitBtn.dataset.originalText = submitBtn.textContent;

    registerForm.addEventListener('submit', async function(e) {
      e.preventDefault();
      
      const fullName = document.getElementById('fullname')?.value || document.getElementById('full-name')?.value;
      const username = document.getElementById('username')?.value;
      const email = document.getElementById('email')?.value;
      const password = document.getElementById('password')?.value;
      const confirmPassword = document.getElementById('confirm-password')?.value;

      // Validation
      if (!username || !email || !password || !confirmPassword) {
        return showMessage('All fields are required', 'error');
      }
      
      if (password !== confirmPassword) {
        return showMessage('Passwords do not match', 'error');
      }
      
      if (password.length < 6) {
        return showMessage('Password must be at least 6 characters long', 'error');
      }
      
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return showMessage('Please enter a valid email address', 'error');
      }

      // Check server first
      if (!(await checkServer())) return;

      setLoading(submitBtn, true);
      
      try {
        const response = await fetch(`${API_URL}/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            username, 
            email, 
            password, 
            fullName: fullName || username 
          })
        });
        
        const data = await response.json();

        if (response.ok) {
          showMessage('Registration successful! Redirecting to login...', 'success');
          setTimeout(() => window.location.href = 'login.html', 1500);
        } else {
          showMessage(data.message || 'Registration failed', 'error');
        }
      } catch (error) {
        console.error('Registration error:', error);
        showMessage('Connection error. Make sure the server is running.', 'error');
      } finally {
        setLoading(submitBtn, false);
      }
    });
  }

  // Initialize
  checkAuth();
  
  // Make logout function global
  window.logout = logout;

  // Add basic styles
  const style = document.createElement('style');
  style.textContent = `
    .message {
      transition: all 0.3s ease;
      border-radius: 5px;
      font-family: inherit;
    }
    .auth-buttons {
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .auth-btn {
      padding: 8px 16px;
      text-decoration: none;
      border-radius: 4px;
      transition: all 0.3s ease;
      font-weight: 500;
    }
    .login-btn {
      color: #8B4513;
      border: 1px solid #8B4513;
    }
    .login-btn:hover {
      background: #8B4513;
      color: white;
    }
    .register-btn {
      background: #8B4513;
      color: white;
    }
    .register-btn:hover {
      background: #654321;
    }
    .user-icon {
      font-size: 24px;
      text-decoration: none;
      padding: 8px;
      border-radius: 50%;
      transition: background 0.3s ease;
    }
    .user-icon:hover {
      background: rgba(139, 69, 19, 0.1);
    }
    .logout-btn {
      background: #8B4513;
      color: white;
      border: none;
      padding: 8px 16px;
      border-radius: 4px;
      cursor: pointer;
      transition: background 0.3s ease;
    }
    .logout-btn:hover {
      background: #654321;
    }
    .user-greeting {
      color: #8B4513;
      font-weight: 500;
    }
    button:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
  `;
  document.head.appendChild(style);
});