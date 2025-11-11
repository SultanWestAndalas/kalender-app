import React from 'react';

function Sidebar({ onAddEvent, categories, search, selectedCategory, onSearchChange, onCategoryChange, style }) {
  const handleSearch = e => {
    const value = e.target.value;
    onSearchChange(value);
  };

  const handleCategoryChange = cat => {
    onCategoryChange(cat);
  };

  return (
    <div style={{
      width: '250px',
      background: 'linear-gradient(180deg, #1e1e1e 0%, #2d2d2d 100%)',
      padding: '20px',
      borderRight: '1px solid #333',
      height: '100vh',
      overflowY: 'auto',
      boxShadow: '2px 0 10px rgba(0,0,0,0.3)',
      ...style
    }}>
      <button onClick={onAddEvent} style={{
        width: '100%',
        padding: '12px',
        background: 'linear-gradient(135deg, #4285f4 0%, #357ae8 100%)',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        marginBottom: '20px',
        fontSize: '14px',
        fontWeight: '500',
        cursor: 'pointer',
        boxShadow: '0 2px 8px rgba(66, 133, 244, 0.3)',
        transition: 'all 0.3s ease'
      }}>
        + Create Event
      </button>

      <input
        type="text"
        placeholder="Search events..."
        value={search}
        onChange={handleSearch}
        style={{
          width: '100%',
          padding: '12px',
          marginBottom: '20px',
          border: '1px solid #555',
          borderRadius: '8px',
          background: '#333',
          color: '#ffffff',
          fontSize: '14px',
          boxSizing: 'border-box'
        }}
      />

      <h3 style={{
        color: '#ffffff',
        marginBottom: '15px',
        fontSize: '16px',
        fontWeight: '600',
        borderBottom: '1px solid #555',
        paddingBottom: '8px'
      }}>Categories</h3>
      <div>
        <button
          className={selectedCategory === '' ? 'selected' : ''}
          onClick={() => handleCategoryChange('')}
          style={{
            display: 'block',
            width: '100%',
            padding: '10px 12px',
            border: 'none',
            textAlign: 'left',
            borderRadius: '6px',
            marginBottom: '5px',
            fontSize: '14px',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
        >
          All
        </button>
        {categories.map(cat => (
          <button
            key={cat}
            className={selectedCategory === cat ? 'selected' : ''}
            onClick={() => handleCategoryChange(cat)}
            style={{
              display: 'block',
              width: '100%',
              padding: '10px 12px',
              border: 'none',
              textAlign: 'left',
              borderRadius: '6px',
              marginBottom: '5px',
              fontSize: '14px',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            {cat}
          </button>
        ))}
      </div>
    </div>
  );
}

export default Sidebar;
