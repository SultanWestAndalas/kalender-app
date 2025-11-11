import React, { useState } from 'react';

function Login({ onLogin }) {
  const [form, setForm] = useState({ username: '', password: '' });

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = e => {
    e.preventDefault();
    fetch('http://127.0.0.1:8000/api/token/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
      .then(res => res.json())
      .then(data => {
        if (data.access) {
          localStorage.setItem('access_token', data.access);
          localStorage.setItem('refresh_token', data.refresh);
          onLogin && onLogin(data.access);
        } else {
          alert('Login failed');
        }
      })
      .catch(err => console.error('Login error', err));
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: 12 }}>
      <input name="username" value={form.username} onChange={handleChange} placeholder="username" required />
      <input name="password" type="password" value={form.password} onChange={handleChange} placeholder="password" required />
      <button type="submit">Login</button>
    </form>
  );
}

export default Login;
