const mysql = require('mysql2/promise');

const dbConfig = {
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: '',
  database: 'hr_system',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

const pool = mysql.createPool(dbConfig);

async function connectToDatabase() {
  try {
    // First, create database if not exists
    const tempConnection = await mysql.createConnection({
      host: 'localhost',
      port: 3306,
      user: 'root',
      password: ''
    });
    
    await tempConnection.execute('CREATE DATABASE IF NOT EXISTS hr_system');
    console.log('Database hr_system created or already exists');
    await tempConnection.end();
    
    // Now connect to the database
    const connection = await pool.getConnection();
    console.log('Connected to MySQL database: hr_system');
    
    await initializeTables(connection);
    connection.release();
    
    return true;
  } catch (err) {
    console.error('Error connecting to MySQL:', err.message);
    return false;
  }
}

async function initializeTables(connection) {
  try {
    // Create departments table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS departments (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        description TEXT
      )
    `);
    
    // Create employees table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS employees (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        phone VARCHAR(20),
        department_id INT,
        position VARCHAR(100),
        salary DECIMAL(10,2),
        join_date DATE,
        FOREIGN KEY (department_id) REFERENCES departments(id)
      )
    `);
    
    // Create attendances table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS attendances (
        id INT AUTO_INCREMENT PRIMARY KEY,
        employee_id INT,
        date DATE NOT NULL,
        status ENUM('present', 'absent', 'late', 'leave') DEFAULT 'present',
        FOREIGN KEY (employee_id) REFERENCES employees(id)
      )
    `);
    
    // Create leaves table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS leaves (
        id INT AUTO_INCREMENT PRIMARY KEY,
        employee_id INT,
        leave_type VARCHAR(50),
        start_date DATE,
        end_date DATE,
        status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
        FOREIGN KEY (employee_id) REFERENCES employees(id)
      )
    `);
    
    // Create admins table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS admins (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    // Insert default admin if not exists
    const [adminCount] = await connection.execute('SELECT COUNT(*) as count FROM admins');
    if (adminCount[0].count === 0) {
      await connection.execute('INSERT INTO admins (username, password) VALUES (?, ?)', ['admin', 'admin123']);
      console.log('Default admin created');
    }
    
    console.log('Database tables initialized successfully');
    
  } catch (err) {
    console.error('Error creating tables:', err.message);
    throw err;
  }
}

// This function is disabled - only reads your existing data from the database
// To insert sample data, uncomment the code below
/*
async function insertSampleData(connection) {
  // Your sample data insertion code here
}
*/

// Query helper functions
async function getStats() {
  const connection = await pool.getConnection();
  try {
    const stats = {};
    
    const [empCount] = await connection.execute('SELECT COUNT(*) as count FROM employees');
    stats.totalEmployees = empCount[0].count;
    
    const [deptCount] = await connection.execute('SELECT COUNT(*) as count FROM departments');
    stats.totalDepartments = deptCount[0].count;
    
    const today = new Date().toISOString().split('T')[0];
    const [presentCount] = await connection.execute(
      'SELECT COUNT(*) as count FROM attendances WHERE date = ? AND status = "present"',
      [today]
    );
    stats.presentToday = presentCount[0].count;
    
    const [pendingCount] = await connection.execute(
      'SELECT COUNT(*) as count FROM leaves WHERE status = "pending"'
    );
    stats.pendingLeaves = pendingCount[0].count;
    
    return stats;
  } finally {
    connection.release();
  }
}

async function getEmployees() {
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.execute(`
      SELECT e.*, d.name as department_name 
      FROM employees e 
      LEFT JOIN departments d ON e.department_id = d.id
    `);
    return rows;
  } finally {
    connection.release();
  }
}

async function getDepartments() {
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.execute('SELECT * FROM departments');
    return rows;
  } finally {
    connection.release();
  }
}

async function getAttendance() {
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.execute(`
      SELECT a.*, e.name as employee_name 
      FROM attendances a 
      LEFT JOIN employees e ON a.employee_id = e.id
      ORDER BY a.date DESC
      LIMIT 50
    `);
    return rows;
  } finally {
    connection.release();
  }
}

async function getLeaves() {
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.execute(`
      SELECT l.*, e.name as employee_name 
      FROM leaves l 
      LEFT JOIN employees e ON l.employee_id = e.id
      ORDER BY l.start_date DESC
    `);
    return rows;
  } finally {
    connection.release();
  }
}

// Admin CRUD operations
async function getAdmins() {
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.execute('SELECT id, username, created_at FROM admins ORDER BY created_at DESC');
    return rows;
  } finally {
    connection.release();
  }
}

async function addAdmin(username, password) {
  const connection = await pool.getConnection();
  try {
    await connection.execute('INSERT INTO admins (username, password) VALUES (?, ?)', [username, password]);
    return { success: true, message: 'Admin added successfully' };
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      return { success: false, message: 'Username already exists' };
    }
    throw err;
  } finally {
    connection.release();
  }
}

async function deleteAdmin(id) {
  const connection = await pool.getConnection();
  try {
    await connection.execute('DELETE FROM admins WHERE id = ?', [id]);
    return { success: true, message: 'Admin deleted successfully' };
  } finally {
    connection.release();
  }
}

async function updateAdmin(id, username, password) {
  const connection = await pool.getConnection();
  try {
    if (password) {
      await connection.execute('UPDATE admins SET username = ?, password = ? WHERE id = ?', [username, password, id]);
    } else {
      await connection.execute('UPDATE admins SET username = ? WHERE id = ?', [username, id]);
    }
    return { success: true, message: 'Admin updated successfully' };
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      return { success: false, message: 'Username already exists' };
    }
    throw err;
  } finally {
    connection.release();
  }
}

// Attendance CRUD operations
async function addAttendance(employee_id, date, status) {
  const connection = await pool.getConnection();
  try {
    await connection.execute('INSERT INTO attendances (employee_id, date, status) VALUES (?, ?, ?)', [employee_id, date, status]);
    return { success: true, message: 'Attendance added successfully' };
  } finally {
    connection.release();
  }
}

async function updateAttendance(id, status) {
  const connection = await pool.getConnection();
  try {
    await connection.execute('UPDATE attendances SET status = ? WHERE id = ?', [status, id]);
    return { success: true, message: 'Attendance updated successfully' };
  } finally {
    connection.release();
  }
}

async function deleteAttendance(id) {
  const connection = await pool.getConnection();
  try {
    await connection.execute('DELETE FROM attendances WHERE id = ?', [id]);
    return { success: true, message: 'Attendance deleted successfully' };
  } finally {
    connection.release();
  }
}

// Employee CRUD operations
async function addEmployee(name, email, phone, department_id, position, salary, join_date) {
  const connection = await pool.getConnection();
  try {
    await connection.execute(
      'INSERT INTO employees (name, email, phone, department_id, position, salary, join_date) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [name, email, phone, department_id, position, salary, join_date]
    );
    return { success: true, message: 'Employee added successfully' };
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      return { success: false, message: 'Email already exists' };
    }
    throw err;
  } finally {
    connection.release();
  }
}

async function updateEmployee(id, name, email, phone, department_id, position, salary, join_date) {
  const connection = await pool.getConnection();
  try {
    await connection.execute(
      'UPDATE employees SET name = ?, email = ?, phone = ?, department_id = ?, position = ?, salary = ?, join_date = ? WHERE id = ?',
      [name, email, phone, department_id, position, salary, join_date, id]
    );
    return { success: true, message: 'Employee updated successfully' };
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      return { success: false, message: 'Email already exists' };
    }
    throw err;
  } finally {
    connection.release();
  }
}

async function deleteEmployee(id) {
  const connection = await pool.getConnection();
  try {
    await connection.execute('DELETE FROM employees WHERE id = ?', [id]);
    return { success: true, message: 'Employee deleted successfully' };
  } finally {
    connection.release();
  }
}

// Leave operations
async function updateLeaveStatus(id, status) {
  const connection = await pool.getConnection();
  try {
    await connection.execute('UPDATE leaves SET status = ? WHERE id = ?', [status, id]);
    return { success: true, message: 'Leave status updated successfully' };
  } finally {
    connection.release();
  }
}

// Department CRUD operations
async function addDepartment(name, description) {
  const connection = await pool.getConnection();
  try {
    await connection.execute('INSERT INTO departments (name, description) VALUES (?, ?)', [name, description]);
    return { success: true, message: 'Department added successfully' };
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      return { success: false, message: 'Department name already exists' };
    }
    throw err;
  } finally {
    connection.release();
  }
}

async function updateDepartment(id, name, description) {
  const connection = await pool.getConnection();
  try {
    await connection.execute('UPDATE departments SET name = ?, description = ? WHERE id = ?', [name, description, id]);
    return { success: true, message: 'Department updated successfully' };
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      return { success: false, message: 'Department name already exists' };
    }
    throw err;
  } finally {
    connection.release();
  }
}

async function deleteDepartment(id) {
  const connection = await pool.getConnection();
  try {
    await connection.execute('DELETE FROM departments WHERE id = ?', [id]);
    return { success: true, message: 'Department deleted successfully' };
  } finally {
    connection.release();
  }
}

module.exports = { 
  pool, 
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
};

