import React from 'react';
import { useNavigate } from 'react-router-dom';
import CalendarView from './CalendarView';

function HomePage() {
  const navigate = useNavigate();

  // Sample events for demo
  const sampleEvents = [
    {
      id: 1,
      title: 'Welcome to Calendar App',
      start: new Date(),
      end: new Date(Date.now() + 60 * 60 * 1000), // 1 hour later
      allDay: false,
      resource: {
        id: 1,
        title: 'Welcome to Calendar App',
        description: 'This is a demo event. Please login to create your own events.',
        start_time: new Date().toISOString(),
        end_time: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
        location: '',
        category: 'Demo'
      }
    }
  ];

  return (
    <div className="App dark">
      <header className="header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <h1 style={{ margin: 0, fontSize: '24px', fontWeight: '400' }}>Calendar</h1>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button onClick={() => navigate('/register')} style={{
            background: 'transparent',
            color: '#ffffff',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            padding: '8px 16px',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '14px'
          }}>Register</button>
          <button onClick={() => navigate('/login')} style={{
            background: 'transparent',
            color: '#ffffff',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            padding: '8px 16px',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '14px'
          }}>Login</button>
        </div>
      </header>
      <div className="main-content">
        <div className="calendar-container">
          <div style={{ textAlign: 'center', marginBottom: '20px' }}>
            <h2>Welcome to Calendar App</h2>
            <p>Please register or login to manage your events.</p>
          </div>
          <CalendarView
            events={sampleEvents}
            onSelectEvent={() => {}}
            onSelectSlot={() => {}}
            onEventDrop={() => {}}
          />
        </div>
      </div>
    </div>
  );
}

export default HomePage;
