document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('registerForm');
  
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
  
      const username = document.getElementById('username')?.value.trim();
      const email = document.getElementById('email')?.value.trim();
      const password = document.getElementById('password')?.value;
      const confirmPassword = document.getElementById('confirm-password')?.value;
      
      function showFormAlert(message, type = 'error') {
        const alertBox = document.getElementById('formAlert');
        alertBox.textContent = message;
      
        alertBox.style.backgroundColor = type === 'error' ? '#ffe0e0' : '#e0ffe0';
        alertBox.style.color = type === 'error' ? '#a94442' : '#2d6a4f';
        alertBox.style.borderColor = type === 'error' ? '#f5c6cb' : '#c3e6cb';
      
        alertBox.style.display = 'block';
      
        // Auto-hide after 4 seconds
        setTimeout(() => {
          alertBox.style.display = 'none';
        }, 4000);
      }
      
      // client-side validation
      if (!username || !email || !password || !confirmPassword) {
        showFormAlert('All fields are required!');
        return;
      }
      
      if (password !== confirmPassword) {
        showFormAlert('Passwords do not match!');
        return;
      }
      
  
      try {
        const response = await fetch('/api/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ username, email, password })
        });
  
        const data = await response.json();
  
        if (response.ok) {
          alert(data.message || 'Registered successfully!');
          window.location.href = 'login.html'; // redirect to login
        } else {
          alert(data.message || 'Registration failed.');
        }
      } catch (err) {
        console.error('Registration error:', err);
        alert('An error occurred. Please try again later.');
      }
    });
  });
  