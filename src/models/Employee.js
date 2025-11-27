const { db } = require('../config/database');

class Employee {
  // Get all employees
  static getAll() {
    const query = `SELECT * FROM employees ORDER BY created_at DESC`;
    return db.prepare(query).all();
  }

  // Get all employees with their tasks
  static getAllWithTasks() {
    const employees = db.prepare(`SELECT * FROM employees ORDER BY id`).all();
    
    const tasksByEmployee = db.prepare(`
      SELECT * FROM tasks WHERE employee_id = ? ORDER BY created_at DESC
    `);

    return employees.map(emp => ({
      ...emp,
      tasks: tasksByEmployee.all(emp.id)
    }));
  }

  // Get employee by ID
  static getById(id) {
    const query = `SELECT * FROM employees WHERE id = ?`;
    return db.prepare(query).get(id);
  }

  // Get employee by ID with tasks
  static getByIdWithTasks(id) {
    const employee = db.prepare(`SELECT * FROM employees WHERE id = ?`).get(id);
    
    if (!employee) return null;

    const tasks = db.prepare(`SELECT * FROM tasks WHERE employee_id = ?`).all(id);
    
    return { ...employee, tasks };
  }

  // Get employee by email
  static getByEmail(email) {
    const query = `SELECT * FROM employees WHERE email = ?`;
    return db.prepare(query).get(email);
  }

  // Create new employee
  static create({ name, role, email, avatar }) {
    const query = `
      INSERT INTO employees (name, role, email, avatar)
      VALUES (?, ?, ?, ?)
    `;
    
    const result = db.prepare(query).run(name, role, email, avatar || name.split(' ').map(n => n[0]).join(''));
    
    return this.getById(result.lastInsertRowid);
  }

  // Update employee
  static update(id, { name, role, email, avatar }) {
    const query = `
      UPDATE employees 
      SET name = COALESCE(?, name),
          role = COALESCE(?, role),
          email = COALESCE(?, email),
          avatar = COALESCE(?, avatar),
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `;
    
    db.prepare(query).run(name, role, email, avatar, id);
    
    return this.getById(id);
  }

  // Delete employee
  static delete(id) {
    const query = `DELETE FROM employees WHERE id = ?`;
    const result = db.prepare(query).run(id);
    return result.changes > 0;
  }
}

module.exports = Employee;