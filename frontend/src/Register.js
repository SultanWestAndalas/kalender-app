import React, { useState } from 'react';

function Register({ onLogin }) {
  const [form, setForm] = useState({ username: '', password: '' });

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://127.0.0.1:8000/api/register/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.status === 201) {
        // Auto-login after successful registration
        const tokenRes = await fetch('http://127.0.0.1:8000/api/token/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        });
        const tokenData = await tokenRes.json();
        if (tokenData.access) {
          localStorage.setItem('access_token', tokenData.access);
          localStorage.setItem('refresh_token', tokenData.refresh);
          onLogin && onLogin(tokenData.access);
        }
      } else {
        alert(data.detail || 'Registration failed');
      }
    } catch (err) {
      console.error('Register error', err);
      alert('Registration error');
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: 12 }}>
      <input name="username" value={form.username} onChange={handleChange} placeholder="username" required />
      <input name="password" type="password" value={form.password} onChange={handleChange} placeholder="password" required />
      <button type="submit">Register</button>
    </form>
  );
}

export default Register;
