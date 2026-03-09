import React from 'react';

function Navbar({ activeTab, setActiveTab, onLogout }) {
  const menuItems = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'employees', label: 'Employees', icon: '👥' },
    { id: 'departments', label: 'Departments', icon: '🏢' },
    { id: 'attendance', label: 'Attendance', icon: '✅' },
    { id: 'leaves', label: 'Leaves', icon: '📋' },
    { id: 'admins', label: 'Admins', icon: '⚙️' },
  ];

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <h1>HR System</h1>
        <span className="admin-badge">Admin</span>
      </div>
      <div className="navbar-menu">
        {menuItems.map((item) => (
          <button
            key={item.id}
            className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
            onClick={() => setActiveTab(item.id)}
          >
            <span className="nav-icon">{item.icon}</span>
            <span className="nav-label">{item.label}</span>
          </button>
        ))}
      </div>
      <div className="navbar-footer">
        <button className="logout-btn" onClick={onLogout}>
          🚪 Logout
        </button>
      </div>
    </nav>
  );
}

export default Navbar;

