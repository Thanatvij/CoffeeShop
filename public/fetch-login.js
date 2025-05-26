document.getElementById('loginForm').addEventListener('submit', async function (e) {
  e.preventDefault();

  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  try {
    const response = await fetch('http://localhost:5500/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include', // very important for session cookies
      body: JSON.stringify({ email, password })
    });

    const result = await response.json();

    if (response.ok) {
      // Redirect if login successful
      window.location.href = 'index.html';
    } else {
      alert(result.message || 'Login failed');
    }
  } catch (err) {
    console.error('Fetch error:', err);
    alert('Error logging in');
  }
});
