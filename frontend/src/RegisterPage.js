import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function RegisterPage() {
  const [form, setForm] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    first_name: '',
    last_name: '',
    email: '',
    time_zone: 'UTC',
    date_of_birth: ''
  });
  const navigate = useNavigate();

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    try {
      const res = await fetch('http://127.0.0.1:8000/api/register/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: form.username,
          password: form.password,
          password_confirm: form.confirmPassword,
          first_name: form.first_name,
          last_name: form.last_name,
          email: form.email,
          profile: {
            time_zone: form.time_zone,
            date_of_birth: form.date_of_birth || null
          }
        }),
      });
      const data = await res.json();
      if (res.status === 201) {
        // Auto-login after successful registration
        const tokenRes = await fetch('http://127.0.0.1:8000/api/token/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username: form.username, password: form.password }),
        });
        const tokenData = await tokenRes.json();
        if (tokenData.access) {
          localStorage.setItem('access_token', tokenData.access);
          localStorage.setItem('refresh_token', tokenData.refresh);
          navigate('/calendar');
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
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      background: '#121212',
      color: '#ffffff'
    }}>
      <div style={{
        background: '#1e1e1e',
        padding: '40px',
        borderRadius: '8px',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
        width: '400px',
        maxHeight: '80vh',
        overflowY: 'auto'
      }}>
        <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Register</h2>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '15px' }}>
            <input
              name="username"
              value={form.username}
              onChange={handleChange}
              placeholder="Username"
              required
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #555',
                borderRadius: '4px',
                background: '#333',
                color: '#ffffff',
                boxSizing: 'border-box'
              }}
            />
          </div>
          <div style={{ marginBottom: '15px' }}>
            <input
              name="first_name"
              value={form.first_name}
              onChange={handleChange}
              placeholder="First Name"
              required
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #555',
                borderRadius: '4px',
                background: '#333',
                color: '#ffffff',
                boxSizing: 'border-box'
              }}
            />
          </div>
          <div style={{ marginBottom: '15px' }}>
            <input
              name="last_name"
              value={form.last_name}
              onChange={handleChange}
              placeholder="Last Name"
              required
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #555',
                borderRadius: '4px',
                background: '#333',
                color: '#ffffff',
                boxSizing: 'border-box'
              }}
            />
          </div>
          <div style={{ marginBottom: '15px' }}>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Email"
              required
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #555',
                borderRadius: '4px',
                background: '#333',
                color: '#ffffff',
                boxSizing: 'border-box'
              }}
            />
          </div>
          <div style={{ marginBottom: '15px' }}>
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Password"
              required
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #555',
                borderRadius: '4px',
                background: '#333',
                color: '#ffffff',
                boxSizing: 'border-box'
              }}
            />
          </div>
          <div style={{ marginBottom: '15px' }}>
            <input
              name="confirmPassword"
              type="password"
              value={form.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm Password"
              required
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #555',
                borderRadius: '4px',
                background: '#333',
                color: '#ffffff',
                boxSizing: 'border-box'
              }}
            />
          </div>
          <div style={{ marginBottom: '15px' }}>
            <select
              name="time_zone"
              value={form.time_zone}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #555',
                borderRadius: '4px',
                background: '#333',
                color: '#ffffff',
                boxSizing: 'border-box'
              }}
            >
              <option value="UTC">UTC</option>
              <option value="America/New_York">Eastern Time</option>
              <option value="America/Chicago">Central Time</option>
              <option value="America/Denver">Mountain Time</option>
              <option value="America/Los_Angeles">Pacific Time</option>
              <option value="Europe/London">London</option>
              <option value="Europe/Paris">Paris</option>
              <option value="Asia/Tokyo">Tokyo</option>
              <option value="Asia/Shanghai">Shanghai</option>
            </select>
          </div>
          <div style={{ marginBottom: '20px' }}>
            <input
              name="date_of_birth"
              type="date"
              value={form.date_of_birth}
              onChange={handleChange}
              placeholder="Date of Birth"
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #555',
                borderRadius: '4px',
                background: '#333',
                color: '#ffffff',
                boxSizing: 'border-box'
              }}
            />
          </div>
          <button
            type="submit"
            style={{
              width: '100%',
              padding: '10px',
              background: '#4285f4',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              boxSizing: 'border-box'
            }}
          >
            Register
          </button>
        </form>
        <p style={{ textAlign: 'center', marginTop: '20px' }}>
          Already have an account? <a href="/login" style={{ color: '#4285f4' }}>Login</a>
        </p>
      </div>
    </div>
  );
}

export default RegisterPage;
