const Database = require('better-sqlite3');
const path = require('path');

// Create database file in the database folder
const dbPath = path.join(__dirname, '../../database/tasktracker.db');
const db = new Database(dbPath);

// Enable foreign keys
db.pragma('foreign_keys = ON');

// Create tables
const initializeDatabase = () => {
  // Create Employees table
  db.exec(`
    CREATE TABLE IF NOT EXISTS employees (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name VARCHAR(100) NOT NULL,
      role VARCHAR(100) NOT NULL,
      email VARCHAR(100) UNIQUE NOT NULL,
      avatar VARCHAR(10),
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Create Tasks table
  db.exec(`
    CREATE TABLE IF NOT EXISTS tasks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title VARCHAR(200) NOT NULL,
      status VARCHAR(20) DEFAULT 'Pending' CHECK(status IN ('Pending', 'In Progress', 'Completed')),
      priority VARCHAR(10) DEFAULT 'Medium' CHECK(priority IN ('Low', 'Medium', 'High')),
      employee_id INTEGER NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE
    )
  `);

  console.log('✅ Database initialized successfully');
};

// Seed sample data
const seedDatabase = () => {
  // Check if data already exists
  const employeeCount = db.prepare('SELECT COUNT(*) as count FROM employees').get();
  
  if (employeeCount.count === 0) {
    console.log('🌱 Seeding database with sample data...');

    // Insert employees
    const insertEmployee = db.prepare(`
      INSERT INTO employees (name, role, email, avatar) VALUES (?, ?, ?, ?)
    `);

    const employees = [
      ['Alice Johnson', 'Frontend Developer', 'alice@company.com', 'AJ'],
      ['Bob Smith', 'Backend Developer', 'bob@company.com', 'BS'],
      ['Carol Williams', 'UI/UX Designer', 'carol@company.com', 'CW'],
      ['David Lee', 'Full Stack Developer', 'david@company.com', 'DL'],
      ['Emma Davis', 'Project Manager', 'emma@company.com', 'ED']
    ];

    employees.forEach(emp => insertEmployee.run(...emp));

    // Insert tasks
    const insertTask = db.prepare(`
      INSERT INTO tasks (title, status, priority, employee_id) VALUES (?, ?, ?, ?)
    `);

    const tasks = [
      ['Build login page', 'Completed', 'High', 1],
      ['Implement dashboard', 'In Progress', 'High', 1],
      ['Write unit tests', 'Pending', 'Medium', 1],
      ['API integration', 'Pending', 'High', 2],
      ['Database optimization', 'In Progress', 'Medium', 2],
      ['Design homepage mockup', 'Completed', 'High', 3],
      ['Create icon set', 'Completed', 'Low', 3],
      ['User research report', 'In Progress', 'Medium', 3],
      ['Setup CI/CD pipeline', 'Pending', 'High', 4],
      ['Code review', 'In Progress', 'Low', 4],
      ['Documentation update', 'Pending', 'Medium', 4],
      ['Sprint planning', 'Completed', 'High', 5],
      ['Client meeting preparation', 'Pending', 'High', 5]
    ];

    tasks.forEach(task => insertTask.run(...task));

    console.log('✅ Sample data seeded successfully');
  }
};

module.exports = { db, initializeDatabase, seedDatabase };