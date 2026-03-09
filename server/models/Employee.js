// Employee Model
// Handles all employee-related database operations

const { pool } = require('../config/database');

const EmployeeModel = {
  // Get all employees with department info
  async getAll() {
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
  },

  // Get employee by ID
  async getById(id) {
    const connection = await pool.getConnection();
    try {
      const [rows] = await connection.execute(
        'SELECT * FROM employees WHERE id = ?',
        [id]
      );
      return rows[0];
    } finally {
      connection.release();
    }
  },

  // Create new employee
  async create(employeeData) {
    const connection = await pool.getConnection();
    try {
      const { name, email, phone, department_id, position, salary, join_date } = employeeData;
      const [result] = await connection.execute(
        `INSERT INTO employees (name, email, phone, department_id, position, salary, join_date) 
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [name, email, phone, department_id, position, salary, join_date]
      );
      return { success: true, id: result.insertId };
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        return { success: false, message: 'Email already exists' };
      }
      throw error;
    } finally {
      connection.release();
    }
  },

  // Update employee
  async update(id, employeeData) {
    const connection = await pool.getConnection();
    try {
      const { name, email, phone, department_id, position, salary, join_date } = employeeData;
      await connection.execute(
        `UPDATE employees SET name = ?, email = ?, phone = ?, department_id = ?, 
         position = ?, salary = ?, join_date = ? WHERE id = ?`,
        [name, email, phone, department_id, position, salary, join_date, id]
      );
      return { success: true, message: 'Employee updated successfully' };
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        return { success: false, message: 'Email already exists' };
      }
      throw error;
    } finally {
      connection.release();
    }
  },

  // Delete employee
  async delete(id) {
    const connection = await pool.getConnection();
    try {
      await connection.execute('DELETE FROM employees WHERE id = ?', [id]);
      return { success: true, message: 'Employee deleted successfully' };
    } finally {
      connection.release();
    }
  }
};

module.exports = EmployeeModel;
