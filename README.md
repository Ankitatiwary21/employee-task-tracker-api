# 🚀 Employee Task Tracker API

A RESTful API for managing employees and their tasks. Built with Node.js, Express, and SQLite.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [API Endpoints](#api-endpoints)
- [Request & Response Examples](#request--response-examples)
- [Database Schema](#database-schema)
- [Project Structure](#project-structure)

## ✨ Features

- Full CRUD operations for Employees and Tasks
- SQLite database with proper relationships
- Filter tasks by status, employee, or priority
- Task statistics endpoint
- Input validation and error handling
- Request logging
- RESTful API design
- Auto-seeding of sample data

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| Node.js | Runtime environment |
| Express.js | Web framework |
| SQLite | Database |
| better-sqlite3 | SQLite driver |
| cors | Cross-origin resource sharing |
| dotenv | Environment variables |

## 📦 Installation

### Prerequisites
- Node.js (v14 or higher)
- npm

### Setup Steps

1. **Clone the repository**
```bash
   git clone https://github.com/YOUR_USERNAME/employee-task-tracker-api.git
   cd employee-task-tracker-api
```

2. **Install dependencies**
```bash
   npm install
```

3. **Create environment file**
```bash
   # Create .env file with:
   PORT=5000
   NODE_ENV=development
```

4. **Start the server**
```bash
   # Development mode (with auto-reload)
   npm run dev

   # Production mode
   npm start
```

5. **Server runs at**
```
   http://localhost:5000
```

## 📡 API Endpoints

### Employees

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/employees` | Get all employees |
| GET | `/api/employees?include_tasks=true` | Get employees with tasks |
| GET | `/api/employees/:id` | Get single employee |
| POST | `/api/employees` | Create new employee |
| PUT | `/api/employees/:id` | Update employee |
| DELETE | `/api/employees/:id` | Delete employee |

### Tasks

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/tasks` | Get all tasks |
| GET | `/api/tasks?status=Pending` | Filter tasks by status |
| GET | `/api/tasks?employee_id=1` | Filter tasks by employee |
| GET | `/api/tasks?priority=High` | Filter tasks by priority |
| GET | `/api/tasks/:id` | Get single task |
| GET | `/api/tasks/statistics` | Get task statistics |
| POST | `/api/tasks` | Create new task |
| PUT | `/api/tasks/:id` | Update task |
| DELETE | `/api/tasks/:id` | Delete task |

## 📝 Request & Response Examples

### Get All Employees

**Request:**
```
GET /api/employees
```

**Response:**
```json
{
  "success": true,
  "count": 5,
  "data": [
    {
      "id": 1,
      "name": "Alice Johnson",
      "role": "Frontend Developer",
      "email": "alice@company.com",
      "avatar": "AJ",
      "created_at": "2025-11-27 17:56:20",
      "updated_at": "2025-11-27 17:56:20"
    }
  ]
}
```

### Create New Employee

**Request:**
```
POST /api/employees
Content-Type: application/json

{
  "name": "John Doe",
  "role": "DevOps Engineer",
  "email": "john@company.com"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Employee created successfully",
  "data": {
    "id": 6,
    "name": "John Doe",
    "role": "DevOps Engineer",
    "email": "john@company.com",
    "avatar": "JD",
    "created_at": "2025-11-27 18:00:00",
    "updated_at": "2025-11-27 18:00:00"
  }
}
```

### Get All Tasks

**Request:**
```
GET /api/tasks
```

**Response:**
```json
{
  "success": true,
  "count": 13,
  "data": [
    {
      "id": 1,
      "title": "Build login page",
      "status": "Completed",
      "priority": "High",
      "employee_id": 1,
      "employee_name": "Alice Johnson",
      "employee_avatar": "AJ",
      "created_at": "2025-11-27 17:56:20",
      "updated_at": "2025-11-27 17:56:20"
    }
  ]
}
```

### Create New Task

**Request:**
```
POST /api/tasks
Content-Type: application/json

{
  "title": "Setup monitoring",
  "status": "Pending",
  "priority": "High",
  "employee_id": 1
}
```

**Response:**
```json
{
  "success": true,
  "message": "Task created successfully",
  "data": {
    "id": 14,
    "title": "Setup monitoring",
    "status": "Pending",
    "priority": "High",
    "employee_id": 1,
    "employee_name": "Alice Johnson",
    "employee_avatar": "AJ"
  }
}
```

### Update Task Status

**Request:**
```
PUT /api/tasks/1
Content-Type: application/json

{
  "status": "Completed"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Task updated successfully",
  "data": {
    "id": 1,
    "title": "Build login page",
    "status": "Completed",
    "priority": "High",
    "employee_id": 1
  }
}
```

### Get Task Statistics

**Request:**
```
GET /api/tasks/statistics
```

**Response:**
```json
{
  "success": true,
  "data": {
    "total": 13,
    "completed": 4,
    "inProgress": 4,
    "pending": 5,
    "completionRate": 31
  }
}
```

### Delete Task

**Request:**
```
DELETE /api/tasks/1
```

**Response:**
```json
{
  "success": true,
  "message": "Task deleted successfully",
  "data": {}
}
```

## 🗄️ Database Schema

### Employees Table

| Field | Type | Description |
|-------|------|-------------|
| id | INTEGER (PK) | Auto-increment primary key |
| name | VARCHAR(100) | Employee name |
| role | VARCHAR(100) | Job role |
| email | VARCHAR(100) | Unique email address |
| avatar | VARCHAR(10) | Initials for avatar |
| created_at | DATETIME | Creation timestamp |
| updated_at | DATETIME | Last update timestamp |

### Tasks Table

| Field | Type | Description |
|-------|------|-------------|
| id | INTEGER (PK) | Auto-increment primary key |
| title | VARCHAR(200) | Task title |
| status | VARCHAR(20) | Pending / In Progress / Completed |
| priority | VARCHAR(10) | Low / Medium / High |
| employee_id | INTEGER (FK) | References employees.id |
| created_at | DATETIME | Creation timestamp |
| updated_at | DATETIME | Last update timestamp |

## 📁 Project Structure
```
backend/
├── database/
│   └── tasktracker.db      # SQLite database file
├── src/
│   ├── config/
│   │   └── database.js     # Database configuration
│   ├── controllers/
│   │   ├── employeeController.js
│   │   └── taskController.js
│   ├── models/
│   │   ├── Employee.js
│   │   └── Task.js
│   ├── routes/
│   │   ├── employeeRoutes.js
│   │   └── taskRoutes.js
│   └── server.js           # Main entry point
├── .env                    # Environment variables
├── package.json
└── README.md
```

## 🔍 Error Handling

The API returns consistent error responses:
```json
{
  "success": false,
  "error": "Error message here"
}
```

### HTTP Status Codes

| Code | Description |
|------|-------------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request |
| 404 | Not Found |
| 500 | Server Error |

## 📝 Assumptions Made

1. Each task belongs to exactly one employee
2. Deleting an employee cascades to delete their tasks
3. Task status is limited to: Pending, In Progress, Completed
4. Task priority is limited to: Low, Medium, High
5. Email addresses must be unique for employees

## 👩‍💻 Author

**Ankita Tiwary**

## 📄 License

This project is created as part of the ProU Technology Backend Internship Assessment.
```

5. **Save** (`Ctrl + S`)

---

## **Step 5: Push Backend to GitHub**

### 5.1 Create `.gitignore` file

1. In `backend` folder root → **New File**
2. Name it: **`.gitignore`**
3. Paste:
```
node_modules/
.env
database/*.db
.DS_Store