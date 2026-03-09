# HRSystem - Complete Code Execution Guide

## Table of Contents
1. [System Overview](#system-overview)
2. [Architecture Flow](#architecture-flow)
3. [Step-by-Step Execution](#step-by-step-execution)
4. [Database Layer](#database-layer)
5. [Backend API](#backend-api)
6. [Frontend Application](#frontend-application)
7. [Data Flow Diagrams](#data-flow-diagrams)

---

## System Overview

The HR System is a full-stack web application for managing:
- **Employee Management**: Add, edit, delete employees
- **Department Management**: Manage company departments
- **Attendance Tracking**: Mark and track employee attendance
- **Leave Management**: Handle employee leave requests
- **Admin Management**: Manage system administrators

### Tech Stack
- **Frontend**: React.js (Port 3000)
- **Backend**: Node.js + Express (Port 5000)
- **Database**: MySQL (Port 3306)
- **Styling**: CSS3 with responsive design

---

## Architecture Flow

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           USER'S BROWSER                                │
│                                                                         │
│  ┌─────────────────┐         ┌─────────────────────────────────────────┐ │
│  │   Login Page    │────────▶│           React App (Port 3000)        │ │
│  │   (Login.js)    │         │  ┌─────────────────────────────────┐  │ │
│  └─────────────────┘         │  │         App.js                   │  │ │
│                             │  │  - Manages authentication state    │  │ │
│  ┌─────────────────┐         │  │  - Routes to Login or Dashboard  │  │ │
│  │  Dashboard Page │         │  └─────────────────────────────────┘  │ │
│  │ (Dashboard.js)  │         │                   │                     │ │
│  └─────────────────┘         │                   ▼                     │ │
│                             │  ┌─────────────────────────────────┐     │ │
│  ┌─────────────────┐         │  │       API Calls (fetch)        │     │ │
│  │  Navigation Bar │         │  │   /api/login, /api/employees   │     │ │
│  │   (Navbar.js)   │         │  └─────────────────────────────────┘     │ │
│  └─────────────────┘         └──────────────────┬──────────────────────┘ │
│                                                  │                        │
└──────────────────────────────────────────────────│────────────────────────┘
                                                   │ HTTP Requests
                                                   │ (localhost:5000)
                                                   ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                         BACKEND SERVER (Port 5000)                      │
│                                                                         │
│  ┌────────────────────────────────────────────────────────────────────┐ │
│  │                        server/index.js                              │ │
│  │  ┌──────────────┐  ┌──────────────┐  ┌────────────────────────┐   │ │
│  │  │  Express App │  │   CORS       │  │    API Endpoints      │   │ │
│  │  │  (Web Server)│  │  (Cross-     │  │  - POST /api/login    │   │ │
│  │  │              │  │   Origin)    │  │  - GET  /api/employees │   │ │
│  │  │              │  │              │  │  - POST/PUT/DELETE    │   │ │
│  │  └──────────────┘  └──────────────┘  └────────────────────────┘   │ │
│  └────────────────────────────────────────────────────────────────────┘ │
│                                      │                                   │
│                                      ▼                                   │
│  ┌────────────────────────────────────────────────────────────────────┐ │
│  │                    database.js (MySQL Pool)                        │ │
│  │  ┌──────────────────────────────────────────────────────────────┐  │ │
│  │  │                    Query Functions                            │  │ │
│  │  │  - getEmployees()   - addEmployee()   - deleteEmployee()    │  │ │
│  │  │  - getDepartments()- addDepartment() - deleteDepartment()   │  │ │
│  │  │  - getAttendance()  - addAttendance()  - deleteAttendance()  │  │ │
│  │  │  - getLeaves()      - updateLeaveStatus()                    │  │ │
│  │  │  - getAdmins()      - addAdmin()       - deleteAdmin()       │  │ │
│  │  │  - getStats()                                                 │  │ │
│  │  └──────────────────────────────────────────────────────────────┘  │ │
│  └────────────────────────────────────────────────────────────────────┘ │
│                                      │                                   │
└──────────────────────────────────────│───────────────────────────────────┘
                                       │
                                       │ MySQL Protocol
                                       ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                      DATABASE (MySQL - Port 3306)                       │
│                                                                         │
│  ┌────────────────┐  ┌────────────────┐  ┌────────────────────────┐   │
│  │    admins      │  │  departments   │  │       employees         │   │
│  │  (id,          │  │  (id,          │  │  (id, name, email,     │   │
│  │   username,    │  │   name,        │  │   phone, department_id,│   │
│  │   password)    │  │   description) │  │   position, salary,     │   │
│  └────────────────┘  └────────────────┘  │   join_date)             │   │
│                                          └────────────────────────┘   │
│  ┌────────────────┐  ┌────────────────┐                               │
│  │  attendances  │  │     leaves     │                               │
│  │  (id,         │  │  (id,          │                               │
│  │   employee_id,│  │   employee_id, │                               │
│  │   date,       │  │   leave_type,  │                               │
│  │   status)     │  │   start_date,  │                               │
│  └────────────────┘  │   end_date,    │                               │
│                      │   status)      │                               │
│                      └────────────────┘                               │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## Step-by-Step Execution

### Step 1: Application Startup

#### 1.1 Starting the Database (MySQL)
```bash
# XAMPP MySQL must be running on port 3306
# The database.js connects with these settings:
{
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: '',
  database: 'hr_system'
}
```

**What happens in database.js:**
1. `connectToDatabase()` is called
2. Creates a connection pool (up to 10 connections)
3. Creates the database if not exists: `CREATE DATABASE IF NOT EXISTS hr_system`
4. Initializes all required tables

#### 1.2 Starting the Backend Server
```bash
cd server
node index.js
```

**Execution flow in server/index.js:**

```javascript
// Step 1: Import required modules
const express = require('express');
const cors = require('cors');
const { ... } = require('./database');

// Step 2: Create Express app
const app = express();
const PORT = 5000;

// Step 3: Add middleware
app.use(cors());  // Enable cross-origin requests
app.use(express.json());  // Parse JSON request bodies

// Step 4: Define API routes (explained below)

// Step 5: Start server and connect to database
async function startServer() {
  const dbConnected = await connectToDatabase();
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}
startServer();
```

#### 1.3 Starting the Frontend
```bash
cd client
npm start
```

**Execution flow in client/src/index.js:**
```javascript
// React entry point
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './App.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

---

### Step 2: User Login Process

```
┌──────────┐     POST /api/login      ┌─────────────┐     SQL Query    ┌──────────┐
│  Login   │ ───────────────────────▶ │   Express   │ ───────────────▶ │  MySQL   │
│  Component                          │   Server    │                  │Database  │
└──────────┘                         └─────────────┘                  └──────────┘
     │                                     │                              │
     │ 1. User enters credentials          │                              │
     │ 2. handleSubmit() called            │                              │
     │ 3. fetch('/api/login', ...)         │                              │
     │                                     │                              │
     │                              ┌──────┴──────┐                       │
     │                              │ /api/login  │                       │
     │                              │ endpoint    │                       │
     │                              └──────┬──────┘                       │
     │                                     │                              │
     │                              ┌──────▼──────┐                       │
     │                              │ Query       │                       │
     │                              │ admins table│                       │
     │                              │ WHERE       │                       │
     │                              │ username=?  │                       │
     │                              │ password=?  │                       └────── │
     │                             ┬──────┘                       │
     │                                     │                              │
     │                              ┌──────▼──────┐                       │
     │                              │ Return rows │                       │
     │                              └──────┬──────┘                       │
     │                                     │                              │
     │◀────────────────────────────────────┤                              │
     │     { success: true/false }         │                              │
```

**Detailed Login Flow:**

1. **User Input** (Login.js):
   ```javascript
   // User types username and password
   const [username, setUsername] = useState('');
   const [password, setPassword] = useState('');
   ```

2. **Form Submission** (Login.js):
   ```javascript
   const handleSubmit = async (e) => {
     e.preventDefault();  // Prevent page reload
     
     // Send POST request to backend
     const response = await fetch('/api/login', {
       method: 'POST',
       headers: { 'Content-Type': 'application/json' },
       body: JSON.stringify({ username, password })
     });
     
     const data = await response.json();
     
     if (data.success) {
       onLogin(data.token);  // Call parent function to set auth state
     }
   };
   ```

3. **API Endpoint** (server/index.js):
   ```javascript
   app.post('/api/login', async (req, res) => {
     // Extract credentials from request body
     const { username, password } = req.body;
     
     try {
       // Get database connection from pool
       const connection = await require('./database').pool.getConnection();
       
       // Execute SQL query to find admin
       const [rows] = await connection.execute(
         'SELECT * FROM admins WHERE username = ? AND password = ?',
         [username, password]
       );
       connection.release();
       
       // Check if admin exists
       if (rows.length > 0) {
         res.json({ 
           success: true, 
           message: 'Login successful', 
           token: 'admin-token-' + rows[0].id 
         });
       } else {
         res.status(401).json({ 
           success: false, 
           message: 'Invalid credentials' 
         });
       }
     } catch (err) {
       res.status(500).json({ 
         success: false, 
         message: 'Server error' 
       });
     }
   });
   ```

4. **Authentication State** (App.js):
   ```javascript
   function App() {
     const [isAuthenticated, setIsAuthenticated] = useState(false);
     
     const handleLogin = (token) => {
       setIsAuthenticated(true);
       localStorage.setItem('adminToken', token);  // Store token
     };
     
     return (
       <div className="app">
         {isAuthenticated ? (
           <Dashboard onLogout={handleLogout} />
         ) : (
           <Login onLogin={handleLogin} />
         )}
       </div>
     );
   }
   ```

---

### Step 3: Dashboard Loading

After successful login, the Dashboard component loads:

```javascript
// Dashboard.js - Component Mounts
useEffect(() => {
  fetchDashboardData();  // Load all data on mount
}, []);

const fetchDashboardData = async () => {
  // Fetch all required data in parallel
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
};
```

**API Calls made:**
1. `GET /api/dashboard/stats` - Get dashboard statistics
2. `GET /api/employees` - Get all employees
3. `GET /api/departments` - Get all departments
4. `GET /api/attendance` - Get attendance records
5. `GET /api/leaves` - Get leave requests
6. `GET /api/admins` - Get admin users

---

### Step 4: Navigation

The Navbar component provides navigation between different sections:

```javascript
// Navbar.js
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
      {/* Menu buttons change activeTab state */}
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
    </nav>
  );
}
```

**Dashboard renders different content based on activeTab:**
```javascript
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
```

---

### Step 5: CRUD Operations

#### Adding an Employee

```
User fills form ──▶ Submit ──▶ handleEmployeeSubmit()
                                            │
                                            ▼
                                    Check if editing
                                            │
                    ┌─────────────────────────┴─────────────────────────┐
                    │                                                   │
              editingEmployee                                    !editingEmployee
                    │                                                   │
                    ▼                                                   ▼
            PUT /api/employees/:id                            POST /api/employees
                    │                                                   │
                    └─────────────────────────┬─────────────────────────┘
                                              │
                                              ▼
                                      Express API Endpoint
                                              │
                                              ▼
                                      database.addEmployee()
                                              │
                                              ▼
                                      MySQL INSERT query
```

**Code Flow:**

1. **Frontend** (Dashboard.js):
   ```javascript
   const handleEmployeeSubmit = async (e) => {
     e.preventDefault();
     
     const url = editingEmployee 
       ? `/api/employees/${editingEmployee.id}`  // PUT for edit
       : '/api/employees';                        // POST for add
     const method = editingEmployee ? 'PUT' : 'POST';
     
     const res = await fetch(url, {
       method,
       headers: { 'Content-Type': 'application/json' },
       body: JSON.stringify(employeeForm)
     });
     
     const data = await res.json();
     if (data.success) {
       fetchDashboardData();  // Refresh data
     }
   };
   ```

2. **Backend** (server/index.js):
   ```javascript
   // POST - Add new employee
   app.post('/api/employees', async (req, res) => {
     const { name, email, phone, department_id, position, salary, join_date } = req.body;
     const result = await addEmployee(name, email, phone, department_id, position, salary, join_date);
     res.json(result);
   });

   // PUT - Update employee
   app.put('/api/employees/:id', async (req, res) => {
     const { id } = req.params;
     const { name, email, phone, department_id, position, salary, join_date } = req.body;
     const result = await updateEmployee(id, name, email, phone, department_id, position, salary, join_date);
     res.json(result);
   });

   // DELETE - Remove employee
   app.delete('/api/employees/:id', async (req, res) => {
     const { id } = req.params;
     const result = await deleteEmployee(id);
     res.json(result);
   });
   ```

3. **Database** (database.js):
   ```javascript
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
   ```

---

## Database Layer

### Table Structures

```sql
-- Admins table (for authentication)
CREATE TABLE admins (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Departments table
CREATE TABLE departments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT
);

-- Employees table
CREATE TABLE employees (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  phone VARCHAR(20),
  department_id INT,
  position VARCHAR(100),
  salary DECIMAL(10,2),
  join_date DATE,
  FOREIGN KEY (department_id) REFERENCES departments(id)
);

-- Attendance table
CREATE TABLE attendances (
  id INT AUTO_INCREMENT PRIMARY KEY,
  employee_id INT,
  date DATE NOT NULL,
  status ENUM('present', 'absent', 'late', 'leave') DEFAULT 'present',
  FOREIGN KEY (employee_id) REFERENCES employees(id)
);

-- Leaves table
CREATE TABLE leaves (
  id INT AUTO_INCREMENT PRIMARY KEY,
  employee_id INT,
  leave_type VARCHAR(50),
  start_date DATE,
  end_date DATE,
  status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
  FOREIGN KEY (employee_id) REFERENCES employees(id)
);
```

### Key Database Functions

| Function | Purpose | SQL Operation |
|----------|---------|---------------|
| `getStats()` | Dashboard statistics | COUNT queries on all tables |
| `getEmployees()` | Fetch all employees | SELECT with JOIN to departments |
| `addEmployee()` | Create new employee | INSERT into employees |
| `updateEmployee()` | Modify employee | UPDATE employees |
| `deleteEmployee()` | Remove employee | DELETE from employees |
| `getDepartments()` | Fetch all departments | SELECT from departments |
| `addDepartment()` | Create department | INSERT into departments |
| `getAttendance()` | Fetch attendance | SELECT with JOIN to employees |
| `addAttendance()` | Mark attendance | INSERT into attendances |
| `getLeaves()` | Fetch leave requests | SELECT with JOIN to employees |
| `updateLeaveStatus()` | Approve/reject leave | UPDATE leaves status |
| `getAdmins()` | Fetch admins | SELECT from admins |
| `addAdmin()` | Create admin | INSERT into admins |

---

## Backend API Endpoints

### Authentication
| Method | Endpoint | Description | Request Body |
|--------|----------|-------------|--------------|
| POST | `/api/login` | Admin login | `{username, password}` |

### Dashboard
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/dashboard/stats` | Get statistics |

### Employees
| Method | Endpoint | Description | Request Body |
|--------|----------|-------------|--------------|
| GET | `/api/employees` | Get all employees | - |
| POST | `/api/employees` | Add employee | `{name, email, phone, department_id, position, salary, join_date}` |
| PUT | `/api/employees/:id` | Update employee | `{name, email, phone, department_id, position, salary, join_date}` |
| DELETE | `/api/employees/:id` | Delete employee | - |

### Departments
| Method | Endpoint | Description | Request Body |
|--------|----------|-------------|--------------|
| GET | `/api/departments` | Get all departments | - |
| POST | `/api/departments` | Add department | `{name, description}` |
| PUT | `/api/departments/:id` | Update department | `{name, description}` |
| DELETE | `/api/departments/:id` | Delete department | - |

### Attendance
| Method | Endpoint | Description | Request Body |
|--------|----------|-------------|--------------|
| GET | `/api/attendance` | Get attendance | - |
| POST | `/api/attendance` | Mark attendance | `{employee_id, date, status}` |
| PUT | `/api/attendance/:id` | Update attendance | `{status}` |
| DELETE | `/api/attendance/:id` | Delete attendance | - |

### Leaves
| Method | Endpoint | Description | Request Body |
|--------|----------|-------------|--------------|
| GET | `/api/leaves` | Get leave requests | - |
| PUT | `/api/leaves/:id` | Update leave status | `{status}` |

### Admins
| Method | Endpoint | Description | Request Body |
|--------|----------|-------------|--------------|
| GET | `/api/admins` | Get all admins | - |
| POST | `/api/admins` | Add admin | `{username, password}` |
| PUT | `/api/admins/:id` | Update admin | `{username, password}` |
| DELETE | `/api/admins/:id` | Delete admin | - |

---

## Frontend Components

### App.js (Main Component)
```javascript
function App() {
  // Manages authentication state
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Called when login is successful
  const handleLogin = (token) => {
    setIsAuthenticated(true);
    localStorage.setItem('adminToken', token);
  };

  // Called when user logs out
  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('adminToken');
  };

  // Conditional rendering based on auth state
  return (
    <div className="app">
      {isAuthenticated ? (
        <Dashboard onLogout={handleLogout} />
      ) : (
        <Login onLogin={handleLogin} />
      )}
    </div>
  );
}
```

### Login.js (Login Component)
- Displays login form
- Validates user input
- Sends credentials to backend
- Handles authentication response

### Dashboard.js (Main Dashboard)
- Fetches and displays all HR data
- Provides CRUD operations
- Manages modal dialogs for forms
- Renders different tabs (Overview, Employees, etc.)

### Navbar.js (Navigation)
- Displays navigation menu
- Highlights active section
- Provides logout button

---

## Data Flow Summary

```
┌──────────────────────────────────────────────────────────────────────┐
│                         COMPLETE DATA FLOW                            │
└──────────────────────────────────────────────────────────────────────┘

1. STARTUP PHASE:
   └─▶ XAMPP MySQL starts (port 3306)
       └─▶ node index.js starts (port 5000)
           └─▶ Database connects & creates tables
               └─▶ npm start runs React (port 3000)

2. LOGIN PHASE:
   └─▶ User enters credentials
       └─▶ Login.js calls fetch('/api/login')
           └─▶ Express receives POST request
               └─▶ database.js queries admins table
                   └─▶ MySQL returns result
                       └─▶ Express responds with success/failure
                           └─▶ App.js updates isAuthenticated state

3. DASHBOARD PHASE:
   └─▶ Dashboard component mounts
       └─▶ useEffect triggers fetchDashboardData()
           └─▶ Multiple fetch calls to API endpoints
               └─▶ Express routes to database functions
                   └─▶ MySQL returns data
                       └─▶ React state updates, UI re-renders

4. CRUD OPERATION PHASE:
   └─▶ User clicks action button (Add/Edit/Delete)
       └─▶ Modal opens or action executes
           └─▶ Form submission triggers API call
               └─▶ Express routes to handler
                   └─▶ Database executes SQL
                       └─▶ Result returned to frontend
                           └─▶ Dashboard refreshes data

5. LOGOUT PHASE:
   └─▶ User clicks logout button
       └─▶ handleLogout() called
           └─▶ localStorage token removed
               └─▶ isAuthenticated set to false
                   └─▶ App.js renders Login component
```

---

## Summary

The HR System follows a classic **three-tier architecture**:

1. **Presentation Layer (Frontend)**:
   - React components handle UI
   - Manages state with useState
   - Uses useEffect for data fetching

2. **Application Layer (Backend)**:
   - Express.js handles HTTP requests
   - Routes to appropriate handlers
   - Returns JSON responses

3. **Data Layer (Database)**:
   - MySQL stores all data
   - Connection pooling for efficiency
   - SQL queries for CRUD operations

The system is fully functional with:
- Responsive design for all devices
- Complete CRUD operations
- Real-time data updates
- Secure authentication

