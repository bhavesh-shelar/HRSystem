const express = require('express');
const cors = require('cors');
const { 
  connectToDatabase, 
  getStats, 
  getEmployees, 
  getDepartments, 
  getAttendance, 
  getLeaves,
  getAdmins,
  addAdmin,
  deleteAdmin,
  updateAdmin,
  addAttendance,
  updateAttendance,
  deleteAttendance,
  addEmployee,
  updateEmployee,
  deleteEmployee,
  updateLeaveStatus,
  addDepartment,
  updateDepartment,
  deleteDepartment
} = require('./database');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Login endpoint - checks against database admins table
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  
  try {
    const connection = await require('./database').pool.getConnection();
    const [rows] = await connection.execute(
      'SELECT * FROM admins WHERE username = ? AND password = ?',
      [username, password]
    );
    connection.release();
    
    if (rows.length > 0) {
      res.json({ success: true, message: 'Login successful', token: 'admin-token-' + rows[0].id });
    } else {
      res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Get dashboard statistics
app.get('/api/dashboard/stats', async (req, res) => {
  try {
    const stats = await getStats();
    res.json(stats);
  } catch (err) {
    console.error('Error fetching stats:', err);
    res.status(500).json({ error: err.message });
  }
});

// Get all employees
app.get('/api/employees', async (req, res) => {
  try {
    const employees = await getEmployees();
    res.json(employees);
  } catch (err) {
    console.error('Error fetching employees:', err);
    res.status(500).json({ error: err.message });
  }
});

// Add employee
app.post('/api/employees', async (req, res) => {
  try {
    const { name, email, phone, department_id, position, salary, join_date } = req.body;
    const result = await addEmployee(name, email, phone, department_id, position, salary, join_date);
    res.json(result);
  } catch (err) {
    console.error('Error adding employee:', err);
    res.status(500).json({ error: err.message });
  }
});

// Update employee
app.put('/api/employees/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, phone, department_id, position, salary, join_date } = req.body;
    const result = await updateEmployee(id, name, email, phone, department_id, position, salary, join_date);
    res.json(result);
  } catch (err) {
    console.error('Error updating employee:', err);
    res.status(500).json({ error: err.message });
  }
});

// Delete employee
app.delete('/api/employees/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await deleteEmployee(id);
    res.json(result);
  } catch (err) {
    console.error('Error deleting employee:', err);
    res.status(500).json({ error: err.message });
  }
});

// Get all departments
app.get('/api/departments', async (req, res) => {
  try {
    const departments = await getDepartments();
    res.json(departments);
  } catch (err) {
    console.error('Error fetching departments:', err);
    res.status(500).json({ error: err.message });
  }
});

// Add department
app.post('/api/departments', async (req, res) => {
  try {
    const { name, description } = req.body;
    const result = await addDepartment(name, description);
    res.json(result);
  } catch (err) {
    console.error('Error adding department:', err);
    res.status(500).json({ error: err.message });
  }
});

// Update department
app.put('/api/departments/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;
    const result = await updateDepartment(id, name, description);
    res.json(result);
  } catch (err) {
    console.error('Error updating department:', err);
    res.status(500).json({ error: err.message });
  }
});

// Delete department
app.delete('/api/departments/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await deleteDepartment(id);
    res.json(result);
  } catch (err) {
    console.error('Error deleting department:', err);
    res.status(500).json({ error: err.message });
  }
});

// Get attendance records
app.get('/api/attendance', async (req, res) => {
  try {
    const attendance = await getAttendance();
    res.json(attendance);
  } catch (err) {
    console.error('Error fetching attendance:', err);
    res.status(500).json({ error: err.message });
  }
});

// Add attendance
app.post('/api/attendance', async (req, res) => {
  try {
    const { employee_id, date, status } = req.body;
    const result = await addAttendance(employee_id, date, status);
    res.json(result);
  } catch (err) {
    console.error('Error adding attendance:', err);
    res.status(500).json({ error: err.message });
  }
});

// Update attendance
app.put('/api/attendance/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const result = await updateAttendance(id, status);
    res.json(result);
  } catch (err) {
    console.error('Error updating attendance:', err);
    res.status(500).json({ error: err.message });
  }
});

// Delete attendance
app.delete('/api/attendance/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await deleteAttendance(id);
    res.json(result);
  } catch (err) {
    console.error('Error deleting attendance:', err);
    res.status(500).json({ error: err.message });
  }
});

// Get leave records
app.get('/api/leaves', async (req, res) => {
  try {
    const leaves = await getLeaves();
    res.json(leaves);
  } catch (err) {
    console.error('Error fetching leaves:', err);
    res.status(500).json({ error: err.message });
  }
});

// Update leave status
app.put('/api/leaves/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const result = await updateLeaveStatus(id, status);
    res.json(result);
  } catch (err) {
    console.error('Error updating leave:', err);
    res.status(500).json({ error: err.message });
  }
});

// Admin management endpoints
app.get('/api/admins', async (req, res) => {
  try {
    const admins = await getAdmins();
    res.json(admins);
  } catch (err) {
    console.error('Error fetching admins:', err);
    res.status(500).json({ error: err.message });
  }
});

// Add admin
app.post('/api/admins', async (req, res) => {
  try {
    const { username, password } = req.body;
    const result = await addAdmin(username, password);
    res.json(result);
  } catch (err) {
    console.error('Error adding admin:', err);
    res.status(500).json({ error: err.message });
  }
});

// Update admin
app.put('/api/admins/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { username, password } = req.body;
    const result = await updateAdmin(id, username, password);
    res.json(result);
  } catch (err) {
    console.error('Error updating admin:', err);
    res.status(500).json({ error: err.message });
  }
});

// Delete admin
app.delete('/api/admins/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await deleteAdmin(id);
    res.json(result);
  } catch (err) {
    console.error('Error deleting admin:', err);
    res.status(500).json({ error: err.message });
  }
});

// Initialize database and start server
async function startServer() {
  const dbConnected = await connectToDatabase();
  
  if (!dbConnected) {
    console.error('Failed to connect to database. Please check if XAMPP MySQL is running.');
    console.log('Make sure XAMPP MySQL service is started!');
  } else {
    console.log('Database connection successful!');
  }
  
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();

