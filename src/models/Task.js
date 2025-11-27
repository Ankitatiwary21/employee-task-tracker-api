const { db } = require('../config/database');

class Task {
  // Get all tasks
  static getAll(filters = {}) {
    let query = `
      SELECT tasks.*, employees.name as employee_name, employees.avatar as employee_avatar
      FROM tasks
      JOIN employees ON tasks.employee_id = employees.id
      WHERE 1=1
    `;
    const params = [];

    // Filter by status
    if (filters.status) {
      query += ` AND tasks.status = ?`;
      params.push(filters.status);
    }

    // Filter by employee_id
    if (filters.employee_id) {
      query += ` AND tasks.employee_id = ?`;
      params.push(filters.employee_id);
    }

    // Filter by priority
    if (filters.priority) {
      query += ` AND tasks.priority = ?`;
      params.push(filters.priority);
    }

    query += ` ORDER BY tasks.created_at DESC`;

    return db.prepare(query).all(...params);
  }

  // Get task by ID
  static getById(id) {
    const query = `
      SELECT tasks.*, employees.name as employee_name, employees.avatar as employee_avatar
      FROM tasks
      JOIN employees ON tasks.employee_id = employees.id
      WHERE tasks.id = ?
    `;
    return db.prepare(query).get(id);
  }

  // Create new task
  static create({ title, status, priority, employee_id }) {
    const query = `
      INSERT INTO tasks (title, status, priority, employee_id)
      VALUES (?, ?, ?, ?)
    `;
    
    const result = db.prepare(query).run(
      title,
      status || 'Pending',
      priority || 'Medium',
      employee_id
    );
    
    return this.getById(result.lastInsertRowid);
  }

  // Update task
  static update(id, { title, status, priority, employee_id }) {
    const query = `
      UPDATE tasks 
      SET title = COALESCE(?, title),
          status = COALESCE(?, status),
          priority = COALESCE(?, priority),
          employee_id = COALESCE(?, employee_id),
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `;
    
    db.prepare(query).run(title, status, priority, employee_id, id);
    
    return this.getById(id);
  }

  // Delete task
  static delete(id) {
    const query = `DELETE FROM tasks WHERE id = ?`;
    const result = db.prepare(query).run(id);
    return result.changes > 0;
  }

  // Get task statistics
  static getStatistics() {
    const stats = db.prepare(`
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN status = 'Completed' THEN 1 ELSE 0 END) as completed,
        SUM(CASE WHEN status = 'In Progress' THEN 1 ELSE 0 END) as in_progress,
        SUM(CASE WHEN status = 'Pending' THEN 1 ELSE 0 END) as pending
      FROM tasks
    `).get();

    return {
      total: stats.total,
      completed: stats.completed,
      inProgress: stats.in_progress,
      pending: stats.pending,
      completionRate: stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0
    };
  }
}

module.exports = Task;
