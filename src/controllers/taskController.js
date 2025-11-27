const Task = require('../models/Task');
const Employee = require('../models/Employee');

// @desc    Get all tasks
// @route   GET /api/tasks
const getAllTasks = (req, res) => {
  try {
    const { status, employee_id, priority } = req.query;
    
    const filters = {};
    if (status) filters.status = status;
    if (employee_id) filters.employee_id = employee_id;
    if (priority) filters.priority = priority;

    const tasks = Task.getAll(filters);

    console.log(`📋 GET /api/tasks - Found ${tasks.length} tasks`);

    res.status(200).json({
      success: true,
      count: tasks.length,
      data: tasks
    });
  } catch (error) {
    console.error('❌ Error fetching tasks:', error.message);
    res.status(500).json({
      success: false,
      error: 'Server Error: Unable to fetch tasks'
    });
  }
};

// @desc    Get single task by ID
// @route   GET /api/tasks/:id
const getTaskById = (req, res) => {
  try {
    const { id } = req.params;
    const task = Task.getById(id);

    if (!task) {
      console.log(`⚠️ GET /api/tasks/${id} - Not found`);
      return res.status(404).json({
        success: false,
        error: `Task with ID ${id} not found`
      });
    }

    console.log(`📋 GET /api/tasks/${id} - Found: ${task.title}`);

    res.status(200).json({
      success: true,
      data: task
    });
  } catch (error) {
    console.error('❌ Error fetching task:', error.message);
    res.status(500).json({
      success: false,
      error: 'Server Error: Unable to fetch task'
    });
  }
};

// @desc    Get task statistics
// @route   GET /api/tasks/statistics
const getTaskStatistics = (req, res) => {
  try {
    const stats = Task.getStatistics();

    console.log(`📊 GET /api/tasks/statistics - Completion rate: ${stats.completionRate}%`);

    res.status(200).json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('❌ Error fetching statistics:', error.message);
    res.status(500).json({
      success: false,
      error: 'Server Error: Unable to fetch statistics'
    });
  }
};

// @desc    Create new task
// @route   POST /api/tasks
const createTask = (req, res) => {
  try {
    const { title, status, priority, employee_id } = req.body;

    // Validation
    if (!title || !employee_id) {
      return res.status(400).json({
        success: false,
        error: 'Please provide title and employee_id'
      });
    }

    // Validate status
    const validStatuses = ['Pending', 'In Progress', 'Completed'];
    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        error: `Invalid status. Must be one of: ${validStatuses.join(', ')}`
      });
    }

    // Validate priority
    const validPriorities = ['Low', 'Medium', 'High'];
    if (priority && !validPriorities.includes(priority)) {
      return res.status(400).json({
        success: false,
        error: `Invalid priority. Must be one of: ${validPriorities.join(', ')}`
      });
    }

    // Check if employee exists
    const employee = Employee.getById(employee_id);
    if (!employee) {
      return res.status(404).json({
        success: false,
        error: `Employee with ID ${employee_id} not found`
      });
    }

    const task = Task.create({ title, status, priority, employee_id });

    console.log(`✅ POST /api/tasks - Created: ${task.title}`);

    res.status(201).json({
      success: true,
      message: 'Task created successfully',
      data: task
    });
  } catch (error) {
    console.error('❌ Error creating task:', error.message);
    res.status(500).json({
      success: false,
      error: 'Server Error: Unable to create task'
    });
  }
};

// @desc    Update task
// @route   PUT /api/tasks/:id
const updateTask = (req, res) => {
  try {
    const { id } = req.params;
    const { title, status, priority, employee_id } = req.body;

    // Check if task exists
    const existingTask = Task.getById(id);
    if (!existingTask) {
      return res.status(404).json({
        success: false,
        error: `Task with ID ${id} not found`
      });
    }

    // Validate status
    const validStatuses = ['Pending', 'In Progress', 'Completed'];
    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        error: `Invalid status. Must be one of: ${validStatuses.join(', ')}`
      });
    }

    // Validate priority
    const validPriorities = ['Low', 'Medium', 'High'];
    if (priority && !validPriorities.includes(priority)) {
      return res.status(400).json({
        success: false,
        error: `Invalid priority. Must be one of: ${validPriorities.join(', ')}`
      });
    }

    // Check if new employee exists
    if (employee_id) {
      const employee = Employee.getById(employee_id);
      if (!employee) {
        return res.status(404).json({
          success: false,
          error: `Employee with ID ${employee_id} not found`
        });
      }
    }

    const task = Task.update(id, { title, status, priority, employee_id });

    console.log(`✅ PUT /api/tasks/${id} - Updated: ${task.title}`);

    res.status(200).json({
      success: true,
      message: 'Task updated successfully',
      data: task
    });
  } catch (error) {
    console.error('❌ Error updating task:', error.message);
    res.status(500).json({
      success: false,
      error: 'Server Error: Unable to update task'
    });
  }
};

// @desc    Delete task
// @route   DELETE /api/tasks/:id
const deleteTask = (req, res) => {
  try {
    const { id } = req.params;

    // Check if task exists
    const existingTask = Task.getById(id);
    if (!existingTask) {
      return res.status(404).json({
        success: false,
        error: `Task with ID ${id} not found`
      });
    }

    Task.delete(id);

    console.log(`🗑️ DELETE /api/tasks/${id} - Deleted: ${existingTask.title}`);

    res.status(200).json({
      success: true,
      message: 'Task deleted successfully',
      data: {}
    });
  } catch (error) {
    console.error('❌ Error deleting task:', error.message);
    res.status(500).json({
      success: false,
      error: 'Server Error: Unable to delete task'
    });
  }
};

module.exports = {
  getAllTasks,
  getTaskById,
  getTaskStatistics,
  createTask,
  updateTask,
  deleteTask
};