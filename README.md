# HR System - Admin Dashboard

A complete HR Management System with React frontend, Node.js backend, and MySQL database.

## Features
- Single admin authentication
- Dashboard with HR statistics
- Employee management
- Department management
- Attendance tracking
- Leave management
- Modern UI with responsive design

## Admin Credentials
- **Username**: admin
- **Password**: admin123

## Prerequisites
1. Node.js installed
2. XAMPP (or any MySQL server) installed and running

## Setup Instructions

### Step 1: Start MySQL (XAMPP)
1. Open XAMPP Control Panel
2. Start Apache and MySQL services
3. MySQL should run on localhost:3306

### Step 2: Install Backend Dependencies
```bash
cd server
npm install
```

### Step 3: Start Backend Server
```bash
node index.js
```
Server will run on http://localhost:5000

### Step 4: Install Frontend Dependencies
Open a new terminal:
```bash
cd client
npm install
```

### Step 5: Start Frontend
```bash
npm start
```
Frontend will open on http://localhost:3000

## Project Structure
```
HRSystem/
├── server/
│   ├── index.js          # Express API server
│   ├── database.js      # MySQL connection & schema
│   └── package.json
├── client/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Login.js
│   │   │   ├── Dashboard.js
│   │   │   └── Navbar.js
│   │   ├── App.js
│   │   ├── App.css
│   │   └── index.js
│   └── package.json
└── README.md
```

## Database
The system automatically creates the `hr_system` database with sample data on first run:
- 5 Departments
- 8 Sample Employees
- Attendance records
- Leave requests

## Tech Stack
- **Frontend**: React.js, CSS3
- **Backend**: Node.js, Express
- **Database**: MySQL

