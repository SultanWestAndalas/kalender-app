import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiMenu, FiCalendar, FiTrendingUp, FiClock, FiCheckCircle } from 'react-icons/fi';
import CalendarView from './CalendarView';
import Sidebar from './Sidebar';
import EventModal from './EventModal';

function CalendarPage() {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [isView, setIsView] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const navigate = useNavigate();

  const fetchEvents = () => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      navigate('/login');
      return;
    }

    fetch('http://127.0.0.1:8000/api/events/', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(response => {
        if (response.status === 401) {
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          navigate('/login');
          return [];
        }
        return response.json();
      })
      .then(data => {
        if (Array.isArray(data)) {
          setEvents(data);
        } else {
          setEvents([]);
        }
      })
      .catch(error => {
        console.error('Error fetching events:', error);
        setEvents([]);
      });
  };

  const filterEvents = useCallback(() => {
    let filtered = events;
    if (search) {
      filtered = filtered.filter(e => e && (e.title.toLowerCase().includes(search.toLowerCase()) || e.description.toLowerCase().includes(search.toLowerCase())));
    }
    if (categoryFilter) {
      filtered = filtered.filter(e => e && e.category === categoryFilter);
    }
    setFilteredEvents(filtered);
  }, [events, search, categoryFilter]);

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    filterEvents();
  }, [filterEvents]);

  const categories = [...new Set(events.filter(e => e && e.category).map(e => e.category))];

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    navigate('/');
  };

  const handleAddEvent = () => {
    setEditingEvent(null);
    setIsView(false);
    setModalOpen(true);
  };

  const handleSaveEvent = (formData) => {
    const token = localStorage.getItem('access_token');
    const headers = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const method = editingEvent ? 'PUT' : 'POST';
    const url = editingEvent ? `http://127.0.0.1:8000/api/events/${editingEvent.id}/` : 'http://127.0.0.1:8000/api/events/';

    fetch(url, {
      method,
      headers,
      body: JSON.stringify(formData)
    })
      .then(res => res.json())
      .then(savedEvent => {
        if (editingEvent) {
          setEvents(prev => prev.map(e => e.id === savedEvent.id ? savedEvent : e));
          alert('Event updated successfully!');
        } else {
          setEvents(prev => [savedEvent, ...prev]);
          alert('Event added successfully!');
        }
      })
      .catch(err => {
        console.error('Error saving event:', err);
        alert('Error saving event');
      });
  };

  const handleDeleteEvent = (eventId) => {
    const token = localStorage.getItem('access_token');
    fetch(`http://127.0.0.1:8000/api/events/${eventId}/`, {
      method: 'DELETE',
      headers: token ? { 'Authorization': `Bearer ${token}` } : {}
    })
      .then(() => {
        setEvents(prev => prev.filter(e => e.id !== eventId));
        alert('Event deleted successfully!');
        setModalOpen(false);
      })
      .catch(err => {
        console.error('Error deleting event:', err);
        alert('Error deleting event');
      });
  };

  const handleFilter = ({ search: s, category: c }) => {
    setSearch(s);
    setCategoryFilter(c);
  };

  const handleEventDrop = ({ event, start, end }) => {
    const updatedEvent = { ...event.resource, start_time: start.toISOString(), end_time: end.toISOString() };
    handleSaveEvent(updatedEvent);
  };

  // Calculate dashboard stats
  const totalEvents = events.length;
  const upcomingEvents = events.filter(event => new Date(event.start_time) > new Date()).length;
  const todayEvents = events.filter(event => {
    const eventDate = new Date(event.start_time).toDateString();
    const today = new Date().toDateString();
    return eventDate === today;
  }).length;

  return (
    <div className="App dark">
      <header className="header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <FiMenu onClick={() => setSidebarOpen(!sidebarOpen)} style={{ cursor: 'pointer', fontSize: '24px' }} />
          <h1 style={{ margin: 0, fontSize: '24px', fontWeight: '400' }}>Calendar</h1>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button onClick={handleLogout} style={{
            background: 'transparent',
            color: '#ffffff',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            padding: '8px 16px',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '14px'
          }}>Logout</button>
        </div>
      </header>
      <div className="main-content">
        {sidebarOpen && (
          <Sidebar
            style={{ width: '250px', transition: 'width 0.3s ease-in-out' }}
            onAddEvent={handleAddEvent}
            categories={categories}
            search={search}
            selectedCategory={categoryFilter}
            onSearchChange={(s) => handleFilter({ search: s, category: categoryFilter })}
            onCategoryChange={(c) => handleFilter({ search, category: c })}
          />
        )}
        <div className="calendar-container">
          {/* Dashboard Stats Cards */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '20px',
            marginBottom: '30px'
          }}>
            <div style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              padding: '20px',
              borderRadius: '12px',
              color: 'white',
              boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
              display: 'flex',
              alignItems: 'center',
              gap: '15px'
            }}>
              <FiCalendar size={32} />
              <div>
                <h3 style={{ margin: '0 0 5px 0', fontSize: '18px', fontWeight: '500' }}>Total Events</h3>
                <p style={{ margin: 0, fontSize: '28px', fontWeight: 'bold' }}>{totalEvents}</p>
              </div>
            </div>

            <div style={{
              background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
              padding: '20px',
              borderRadius: '12px',
              color: 'white',
              boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
              display: 'flex',
              alignItems: 'center',
              gap: '15px'
            }}>
              <FiClock size={32} />
              <div>
                <h3 style={{ margin: '0 0 5px 0', fontSize: '18px', fontWeight: '500' }}>Upcoming Events</h3>
                <p style={{ margin: 0, fontSize: '28px', fontWeight: 'bold' }}>{upcomingEvents}</p>
              </div>
            </div>

            <div style={{
              background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
              padding: '20px',
              borderRadius: '12px',
              color: 'white',
              boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
              display: 'flex',
              alignItems: 'center',
              gap: '15px'
            }}>
              <FiCheckCircle size={32} />
              <div>
                <h3 style={{ margin: '0 0 5px 0', fontSize: '18px', fontWeight: '500' }}>Today's Events</h3>
                <p style={{ margin: 0, fontSize: '28px', fontWeight: 'bold' }}>{todayEvents}</p>
              </div>
            </div>

            <div style={{
              background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
              padding: '20px',
              borderRadius: '12px',
              color: 'white',
              boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
              display: 'flex',
              alignItems: 'center',
              gap: '15px'
            }}>
              <FiTrendingUp size={32} />
              <div>
                <h3 style={{ margin: '0 0 5px 0', fontSize: '18px', fontWeight: '500' }}>Categories</h3>
                <p style={{ margin: 0, fontSize: '28px', fontWeight: 'bold' }}>{categories.length}</p>
              </div>
            </div>
          </div>

          <CalendarView
            events={filteredEvents}
            onSelectEvent={(event) => { setEditingEvent(event.resource); setIsView(true); setModalOpen(true); }}
            onSelectSlot={handleAddEvent}
            onEventDrop={handleEventDrop}
          />
        </div>
      </div>
      <EventModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSaveEvent}
        event={editingEvent}
        onDelete={handleDeleteEvent}
        isView={isView}
        onSwitchToEdit={() => setIsView(false)}
      />
    </div>
  );
}

export default CalendarPage;
