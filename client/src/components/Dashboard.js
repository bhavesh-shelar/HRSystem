import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';

function Dashboard({ onLogout }) {
  const [stats, setStats] = useState({});
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [leaves, setLeaves] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');
  
  const [showEmployeeModal, setShowEmployeeModal] = useState(false);
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [showAttendanceModal, setShowAttendanceModal] = useState(false);
  const [showDepartmentModal, setShowDepartmentModal] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [editingAdmin, setEditingAdmin] = useState(null);
  const [editingDepartment, setEditingDepartment] = useState(null);
  
  const [employeeForm, setEmployeeForm] = useState({
    name: '', email: '', phone: '', department_id: '', position: '', salary: '', join_date: ''
  });
  
  const [adminForm, setAdminForm] = useState({
    username: '', password: ''
  });
  
  const [departmentForm, setDepartmentForm] = useState({
    name: '', description: ''
  });
  
  const [attendanceForm, setAttendanceForm] = useState({
    employee_id: '', date: new Date().toISOString().split('T')[0], status: 'present'
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const statsRes = await fetch('/api/dashboard/stats');
      setStats(await statsRes.json());

      const empRes = await fetch('/api/employees');
      setEmployees(await empRes.json());

      const deptRes = await fetch('/api/departments');
      setDepartments(await deptRes.json());

      const attRes = await fetch('/api/attendance');
      setAttendance(await attRes.json());

      const leaveRes = await fetch('/api/leaves');
      setLeaves(await leaveRes.json());
      
      const adminRes = await fetch('/api/admins');
      setAdmins(await adminRes.json());
    } catch (err) {
      console.error('Error fetching data:', err);
    }
  };

  const handleEmployeeSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = editingEmployee 
        ? `/api/employees/${editingEmployee.id}`
        : '/api/employees';
      const method = editingEmployee ? 'PUT' : 'POST';
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(employeeForm)
      });
      const data = await res.json();
      
      if (data.success) {
        alert(data.message);
        setShowEmployeeModal(false);
        setEditingEmployee(null);
        setEmployeeForm({ name: '', email: '', phone: '', department_id: '', position: '', salary: '', join_date: '' });
        fetchDashboardData();
      } else {
        alert(data.message);
      }
    } catch (err) {
      alert('Error saving employee');
    }
  };

  const handleEmployeeEdit = (emp) => {
    setEditingEmployee(emp);
    setEmployeeForm({
      name: emp.name,
      email: emp.email,
      phone: emp.phone || '',
      department_id: emp.department_id || '',
      position: emp.position || '',
      salary: emp.salary || '',
      join_date: emp.join_date || ''
    });
    setShowEmployeeModal(true);
  };

  const handleEmployeeDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      try {
        const res = await fetch(`/api/employees/${id}`, { method: 'DELETE' });
        const data = await res.json();
        alert(data.message);
        fetchDashboardData();
      } catch (err) {
        alert('Error deleting employee');
      }
    }
  };

  const handleAdminSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingAdmin) {
        const res = await fetch(`/api/admins/${editingAdmin.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(adminForm)
        });
        const data = await res.json();
        alert(data.message);
      } else {
        const res = await fetch('/api/admins', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(adminForm)
        });
        const data = await res.json();
        alert(data.message);
      }
      setShowAdminModal(false);
      setEditingAdmin(null);
      setAdminForm({ username: '', password: '' });
      fetchDashboardData();
    } catch (err) {
      alert('Error saving admin');
    }
  };

  const handleAdminEdit = (admin) => {
    setEditingAdmin(admin);
    setAdminForm({ username: admin.username, password: '' });
    setShowAdminModal(true);
  };

  const handleAdminDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this admin?')) {
      try {
        const res = await fetch(`/api/admins/${id}`, { method: 'DELETE' });
        const data = await res.json();
        alert(data.message);
        fetchDashboardData();
      } catch (err) {
        alert('Error deleting admin');
      }
    }
  };

  const handleAttendanceSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/attendance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(attendanceForm)
      });
      const data = await res.json();
      alert(data.message);
      setShowAttendanceModal(false);
      setAttendanceForm({ employee_id: '', date: new Date().toISOString().split('T')[0], status: 'present' });
      fetchDashboardData();
    } catch (err) {
      alert('Error adding attendance');
    }
  };

  const handleAttendanceUpdate = async (id, status) => {
    try {
      const res = await fetch(`/api/attendance/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      const data = await res.json();
      alert(data.message);
      fetchDashboardData();
    } catch (err) {
      alert('Error updating attendance');
    }
  };

  const handleAttendanceDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this attendance record?')) {
      try {
        const res = await fetch(`/api/attendance/${id}`, { method: 'DELETE' });
        const data = await res.json();
        alert(data.message);
        fetchDashboardData();
      } catch (err) {
        alert('Error deleting attendance');
      }
    }
  };

  const handleLeaveUpdate = async (id, status) => {
    try {
      const res = await fetch(`/api/leaves/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      const data = await res.json();
      alert(data.message);
      fetchDashboardData();
    } catch (err) {
      alert('Error updating leave');
    }
  };

  const handleDepartmentSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = editingDepartment 
        ? `/api/departments/${editingDepartment.id}`
        : '/api/departments';
      const method = editingDepartment ? 'PUT' : 'POST';
      
      console.log('Submitting to:', url, 'with method:', method);
      console.log('Form data:', departmentForm);
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(departmentForm)
      });
      
      console.log('Response status:', res.status);
      const data = await res.json();
      console.log('Department save response:', data);
      
      if (data.success) {
        alert(data.message);
        setShowDepartmentModal(false);
        setEditingDepartment(null);
        setDepartmentForm({ name: '', description: '' });
        fetchDashboardData();
      } else {
        alert(data.message || 'Error saving department');
      }
    } catch (err) {
      console.error('Error saving department:', err);
      alert('Error saving department: ' + err.message);
    }
  };

  const handleDepartmentEdit = (dept) => {
    setEditingDepartment(dept);
    setDepartmentForm({ name: dept.name, description: dept.description || '' });
    setShowDepartmentModal(true);
  };

  const handleDepartmentDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this department?')) {
      try {
        const res = await fetch(`/api/departments/${id}`, { method: 'DELETE' });
        const data = await res.json();
        alert(data.message);
        fetchDashboardData();
      } catch (err) {
        alert('Error deleting department');
      }
    }
  };

  const renderOverview = () => {
  return (
    <div className="overview-container">
      <div className="stats-grid">
        <div className="stat-card" onClick={() => setActiveTab('employees')} style={{ cursor: 'pointer' }}>
          <div className="stat-icon">👥</div>
          <div className="stat-info">
            <h3>{stats.totalEmployees || 0}</h3>
            <p>Total Employees</p>
          </div>
        </div>
        <div className="stat-card" onClick={() => setActiveTab('departments')} style={{ cursor: 'pointer' }}>
          <div className="stat-icon">🏢</div>
          <div className="stat-info">
            <h3>{stats.totalDepartments || 0}</h3>
            <p>Departments</p>
          </div>
        </div>
        <div className="stat-card" onClick={() => setActiveTab('attendance')} style={{ cursor: 'pointer' }}>
          <div className="stat-icon">✅</div>
          <div className="stat-info">
            <h3>{stats.presentToday || 0}</h3>
            <p>Present Today</p>
          </div>
        </div>
        <div className="stat-card" onClick={() => setActiveTab('leaves')} style={{ cursor: 'pointer' }}>
          <div className="stat-icon">📋</div>
          <div className="stat-info">
            <h3>{stats.pendingLeaves || 0}</h3>
            <p>Pending Leaves</p>
          </div>
        </div>
      </div>
      <div className="recent-section">
        <h2>Recent Activity</h2>
        <div className="recent-tables">
          <div className="recent-table">
            <h3>Latest Attendance</h3>
            <table>
              <thead>
                <tr><th>Employee</th><th>Date</th><th>Status</th></tr>
              </thead>
              <tbody>
                {attendance.slice(0, 5).map((att) => (
                  <tr key={att.id}>
                    <td>{att.employee_name}</td>
                    <td>{att.date}</td>
                    <td><span className={`status-badge ${att.status}`}>{att.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="recent-table">
            <h3>Leave Requests</h3>
            <table>
              <thead>
                <tr><th>Employee</th><th>Type</th><th>Status</th></tr>
              </thead>
              <tbody>
                {leaves.slice(0, 5).map((leave) => (
                  <tr key={leave.id}>
                    <td>{leave.employee_name}</td>
                    <td>{leave.leave_type}</td>
                    <td><span className={`status-badge ${leave.status}`}>{leave.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

  const renderEmployees = () => {
    return (
      <div className="table-container">
        <div className="table-header">
          <h2>All Employees</h2>
          <button className="add-btn" onClick={() => { setEditingEmployee(null); setEmployeeForm({ name: '', email: '', phone: '', department_id: '', position: '', salary: '', join_date: '' }); setShowEmployeeModal(true); }}>
            <span className="add-btn-icon">+</span> Add Employee
          </button>
        </div>
        <table className="data-table">
          <thead>
            <tr><th>ID</th><th>Name</th><th>Email</th><th>Phone</th><th>Department</th><th>Position</th><th>Salary</th><th>Join Date</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {employees.map((emp) => (
              <tr key={emp.id}>
                <td>{emp.id}</td>
                <td>{emp.name}</td>
                <td>{emp.email}</td>
                <td>{emp.phone}</td>
                <td>{emp.department_name}</td>
                <td>{emp.position}</td>
                <td>${parseFloat(emp.salary || 0).toLocaleString()}</td>
                <td>{emp.join_date}</td>
                <td>
                  <div className="action-buttons">
                    <button className="btn-edit" onClick={() => handleEmployeeEdit(emp)}>Edit</button>
                    <button className="btn-delete" onClick={() => handleEmployeeDelete(emp.id)}>Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const renderDepartments = () => {
    return (
      <div className="table-container">
        <div className="table-header">
          <h2>All Departments</h2>
          <button className="add-btn" onClick={() => { setEditingDepartment(null); setDepartmentForm({ name: '', description: '' }); setShowDepartmentModal(true); }}>
            <span className="add-btn-icon">+</span> Add Department
          </button>
        </div>
        <table className="data-table">
          <thead>
            <tr><th>ID</th><th>Name</th><th>Description</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {departments.map((dept) => (
              <tr key={dept.id}>
                <td>{dept.id}</td>
                <td>{dept.name}</td>
                <td>{dept.description}</td>
                <td>
                  <div className="action-buttons">
                    <button className="btn-edit" onClick={() => handleDepartmentEdit(dept)}>Edit</button>
                    <button className="btn-delete" onClick={() => handleDepartmentDelete(dept.id)}>Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const renderAttendance = () => {
    return (
      <div className="table-container">
        <div className="table-header">
          <h2>Attendance Records</h2>
          <button className="btn-primary" onClick={() => setShowAttendanceModal(true)}>
            + Mark Attendance
          </button>
        </div>
        <table className="data-table">
          <thead>
            <tr><th>ID</th><th>Employee</th><th>Date</th><th>Status</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {attendance.map((att) => (
              <tr key={att.id}>
                <td>{att.id}</td>
                <td>{att.employee_name}</td>
                <td>{att.date}</td>
                <td>
                  <select value={att.status} onChange={(e) => handleAttendanceUpdate(att.id, e.target.value)} className={`status-select ${att.status}`}>
                    <option value="present">Present</option>
                    <option value="absent">Absent</option>
                    <option value="late">Late</option>
                    <option value="leave">Leave</option>
                  </select>
                </td>
                <td>
                  <button className="btn-delete" onClick={() => handleAttendanceDelete(att.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const renderLeaves = () => {
    return (
      <div className="table-container">
        <h2>Leave Requests</h2>
        <table className="data-table">
          <thead>
            <tr><th>ID</th><th>Employee</th><th>Leave Type</th><th>Start Date</th><th>End Date</th><th>Status</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {leaves.map((leave) => (
              <tr key={leave.id}>
                <td>{leave.id}</td>
                <td>{leave.employee_name}</td>
                <td>{leave.leave_type}</td>
                <td>{leave.start_date}</td>
                <td>{leave.end_date}</td>
                <td><span className={`status-badge ${leave.status}`}>{leave.status}</span></td>
                <td>
                  {leave.status === 'pending' && (
                    <div className="action-buttons">
                      <button className="btn-approve" onClick={() => handleLeaveUpdate(leave.id, 'approved')}>Approve</button>
                      <button className="btn-reject" onClick={() => handleLeaveUpdate(leave.id, 'rejected')}>Reject</button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const renderAdmins = () => {
    return (
      <div className="table-container">
        <div className="table-header">
          <h2>Admin Management</h2>
          <button className="add-btn" onClick={() => { setEditingAdmin(null); setAdminForm({ username: '', password: '' }); setShowAdminModal(true); }}>
            <span className="add-btn-icon">+</span> Add Admin
          </button>
        </div>
        <table className="data-table">
          <thead>
            <tr><th>ID</th><th>Username</th><th>Created At</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {admins.map((admin) => (
              <tr key={admin.id}>
                <td>{admin.id}</td>
                <td>{admin.username}</td>
                <td>{new Date(admin.created_at).toLocaleString()}</td>
                <td>
                  <div className="action-buttons">
                    <button className="btn-edit" onClick={() => handleAdminEdit(admin)}>Edit</button>
                    <button className="btn-delete" onClick={() => handleAdminDelete(admin.id)}>Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'overview': return renderOverview();
      case 'employees': return renderEmployees();
      case 'departments': return renderDepartments();
      case 'attendance': return renderAttendance();
      case 'leaves': return renderLeaves();
      case 'admins': return renderAdmins();
      default: return renderOverview();
    }
  };

  return (
    <div className="dashboard">
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} onLogout={onLogout} />
      <main className="dashboard-content">
        {renderContent()}
      </main>

      {/* Employee Modal */}
      {showEmployeeModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>{editingEmployee ? 'Edit Employee' : 'Add Employee'}</h3>
            <form onSubmit={handleEmployeeSubmit}>
              <input type="text" placeholder="Name" value={employeeForm.name} onChange={(e) => setEmployeeForm({ ...employeeForm, name: e.target.value })} required />
              <input type="email" placeholder="Email" value={employeeForm.email} onChange={(e) => setEmployeeForm({ ...employeeForm, email: e.target.value })} required />
              <input type="text" placeholder="Phone" value={employeeForm.phone} onChange={(e) => setEmployeeForm({ ...employeeForm, phone: e.target.value })} />
              <select value={employeeForm.department_id} onChange={(e) => setEmployeeForm({ ...employeeForm, department_id: e.target.value })}>
                <option value="">Select Department</option>
                {departments.map((d) => (
                  <option key={d.id} value={d.id}>{d.name}</option>
                ))}
              </select>
              <input type="text" placeholder="Position" value={employeeForm.position} onChange={(e) => setEmployeeForm({ ...employeeForm, position: e.target.value })} />
              <input type="number" placeholder="Salary" value={employeeForm.salary} onChange={(e) => setEmployeeForm({ ...employeeForm, salary: e.target.value })} />
              <input type="date" value={employeeForm.join_date} onChange={(e) => setEmployeeForm({ ...employeeForm, join_date: e.target.value })} />
              <div className="modal-actions">
                <button type="submit" className="btn-primary">Save</button>
                <button type="button" className="btn-secondary" onClick={() => { setShowEmployeeModal(false); setEditingEmployee(null); }}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Admin Modal */}
      {showAdminModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>{editingAdmin ? 'Edit Admin' : 'Add Admin'}</h3>
            <form onSubmit={handleAdminSubmit}>
              <input type="text" placeholder="Username" value={adminForm.username} onChange={(e) => setAdminForm({ ...adminForm, username: e.target.value })} required />
              <input type="password" placeholder={editingAdmin ? "New Password (leave blank to keep)" : "Password"} value={adminForm.password} onChange={(e) => setAdminForm({ ...adminForm, password: e.target.value })} required={!editingAdmin} />
              <div className="modal-actions">
                <button type="submit" className="btn-primary">Save</button>
                <button type="button" className="btn-secondary" onClick={() => { setShowAdminModal(false); setEditingAdmin(null); }}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Attendance Modal */}
      {showAttendanceModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Mark Attendance</h3>
            <form onSubmit={handleAttendanceSubmit}>
              <select value={attendanceForm.employee_id} onChange={(e) => setAttendanceForm({ ...attendanceForm, employee_id: e.target.value })} required>
                <option value="">Select Employee</option>
                {employees.map((e) => (
                  <option key={e.id} value={e.id}>{e.name}</option>
                ))}
              </select>
              <input type="date" value={attendanceForm.date} onChange={(e) => setAttendanceForm({ ...attendanceForm, date: e.target.value })} required />
              <select value={attendanceForm.status} onChange={(e) => setAttendanceForm({ ...attendanceForm, status: e.target.value })}>
                <option value="present">Present</option>
                <option value="absent">Absent</option>
                <option value="late">Late</option>
                <option value="leave">Leave</option>
              </select>
              <div className="modal-actions">
                <button type="submit" className="btn-primary">Save</button>
                <button type="button" className="btn-secondary" onClick={() => setShowAttendanceModal(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Department Modal */}
      {showDepartmentModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>{editingDepartment ? 'Edit Department' : 'Add Department'}</h3>
            <form onSubmit={handleDepartmentSubmit}>
              <input type="text" placeholder="Department Name" value={departmentForm.name} onChange={(e) => setDepartmentForm({ ...departmentForm, name: e.target.value })} required />
              <input type="text" placeholder="Description" value={departmentForm.description} onChange={(e) => setDepartmentForm({ ...departmentForm, description: e.target.value })} />
              <div className="modal-actions">
                <button type="submit" className="btn-primary">Save</button>
                <button type="button" className="btn-secondary" onClick={() => { setShowDepartmentModal(false); setEditingDepartment(null); }}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;

