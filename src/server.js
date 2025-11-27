const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { initializeDatabase, seedDatabase } = require('./config/database');
const employeeRoutes = require('./routes/employeeRoutes');
const taskRoutes = require('./routes/taskRoutes');

// Initialize Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`📨 ${req.method} ${req.url}`);
  next();
});

// Initialize Database
initializeDatabase();
seedDatabase();

// Welcome route
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: '🚀 Welcome to Employee Task Tracker API',
    version: '1.0.0',
    endpoints: {
      employees: '/api/employees',
      tasks: '/api/tasks',
      statistics: '/api/tasks/statistics'
    },
    documentation: {
      getAllEmployees: 'GET /api/employees',
      getEmployee: 'GET /api/employees/:id',
      createEmployee: 'POST /api/employees',
      updateEmployee: 'PUT /api/employees/:id',
      deleteEmployee: 'DELETE /api/employees/:id',
      getAllTasks: 'GET /api/tasks',
      getTask: 'GET /api/tasks/:id',
      createTask: 'POST /api/tasks',
      updateTask: 'PUT /api/tasks/:id',
      deleteTask: 'DELETE /api/tasks/:id',
      taskStatistics: 'GET /api/tasks/statistics'
    }
  });
});

// Routes
app.use('/api/employees', employeeRoutes);
app.use('/api/tasks', taskRoutes);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: `Route ${req.originalUrl} not found`
  });
});

// Error Handler
app.use((err, req, res, next) => {
  console.error('❌ Server Error:', err.message);
  res.status(500).json({
    success: false,
    error: 'Internal Server Error'
  });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════════════════════════╗
║                                                            ║
║   🚀 Employee Task Tracker API                             ║
║                                                            ║
║   Server running on: http://localhost:${PORT}                 ║
║   Environment: ${process.env.NODE_ENV || 'development'}                            ║
║                                                            ║
║   Endpoints:                                               ║
║   • GET    /api/employees                                  ║
║   • POST   /api/employees                                  ║
║   • GET    /api/tasks                                      ║
║   • POST   /api/tasks                                      ║
║   • GET    /api/tasks/statistics                           ║
║                                                            ║
╚════════════════════════════════════════════════════════════╝
  `);
});

module.exports = app;