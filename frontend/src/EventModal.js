import React, { useState, useEffect } from 'react';

function EventModal({ isOpen, onClose, onSave, event, onDelete, isView, onSwitchToEdit }) {
  const [form, setForm] = useState({
    title: '',
    description: '',
    start_time: '',
    end_time: '',
    location: '',
    category: ''
  });

  useEffect(() => {
    if (event) {
      const startDate = new Date(event.start_time);
      const endDate = new Date(event.end_time);
      setForm({
        title: event.title || '',
        description: event.description || '',
        start_time: event.start_time ? startDate.getFullYear() + '-' + (startDate.getMonth() + 1).toString().padStart(2, '0') + '-' + startDate.getDate().toString().padStart(2, '0') + 'T' + startDate.getHours().toString().padStart(2, '0') + ':' + startDate.getMinutes().toString().padStart(2, '0') : '',
        end_time: event.end_time ? endDate.getFullYear() + '-' + (endDate.getMonth() + 1).toString().padStart(2, '0') + '-' + endDate.getDate().toString().padStart(2, '0') + 'T' + endDate.getHours().toString().padStart(2, '0') + ':' + endDate.getMinutes().toString().padStart(2, '0') : '',
        location: event.location || '',
        category: event.category || ''
      });
    } else {
      setForm({
        title: '',
        description: '',
        start_time: '',
        end_time: '',
        location: '',
        category: ''
      });
    }
  }, [event, isOpen]);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = e => {
    e.preventDefault();
    const startDate = new Date(form.start_time);
    const endDate = new Date(form.end_time);
    const formattedForm = {
      ...form,
      start_time: form.start_time ? startDate.toISOString() : '',
      end_time: form.end_time ? endDate.toISOString() : ''
    };
    onSave(formattedForm);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    }}>
      <div style={{
        background: '#333',
        color: '#ffffff',
        padding: '20px',
        borderRadius: '8px',
        width: '400px',
        maxWidth: '90%'
      }}>
        {isView && event ? (
          <div>
            <h2>Event Details</h2>
            <div className="form-group">
              <label>Title</label>
              <p>{event.title}</p>
            </div>
            <div className="form-group">
              <label>Description</label>
              <p>{event.description || 'No description'}</p>
            </div>
            <div className="form-group">
              <label>Start Time</label>
              <p>{event.start_time ? new Date(event.start_time).toLocaleString() : 'Invalid Date'}</p>
            </div>
            <div className="form-group">
              <label>End Time</label>
              <p>{event.end_time ? new Date(event.end_time).toLocaleString() : 'Invalid Date'}</p>
            </div>
            <div className="form-group">
              <label>Location</label>
              <p>{event.location || 'No location'}</p>
            </div>
            <div className="form-group">
              <label>Category</label>
              <p>{event.category || 'No category'}</p>
            </div>
            <div className="form-actions">
              <button className="btn btn-primary" type="button" onClick={onSwitchToEdit}>Edit</button>
              <button className="btn btn-danger" type="button" onClick={() => onDelete(event.id)}>Delete</button>
              <button className="btn btn-secondary" type="button" onClick={onClose}>Close</button>
            </div>
          </div>
        ) : (
          <>
            <h2>{event ? 'Edit Event' : 'Add Event'}</h2>
            {event && <button className="btn btn-danger" type="button" onClick={() => onDelete(event.id)} style={{ float: 'right' }}>Delete</button>}
            <div style={{ clear: 'both' }}></div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Title</label>
                <input className="form-input" name="title" value={form.title} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea className="form-input" name="description" value={form.description} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Start Time</label>
                <input className="form-input" name="start_time" type="datetime-local" value={form.start_time} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>End Time</label>
                <input className="form-input" name="end_time" type="datetime-local" value={form.end_time} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Location</label>
                <input className="form-input" name="location" value={form.location} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Category</label>
                <input className="form-input" name="category" value={form.category} onChange={handleChange} />
              </div>
              <div className="form-actions">
                <button className="btn btn-primary" type="submit">Save</button>
                <button className="btn btn-secondary" type="button" onClick={onClose}>Cancel</button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

export default EventModal;
