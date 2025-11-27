const Employee = require('../models/Employee');

// @desc    Get all employees
// @route   GET /api/employees
const getAllEmployees = (req, res) => {
  try {
    const { include_tasks } = req.query;
    
    let employees;
    if (include_tasks === 'true') {
      employees = Employee.getAllWithTasks();
    } else {
      employees = Employee.getAll();
    }

    console.log(`📋 GET /api/employees - Found ${employees.length} employees`);
    
    res.status(200).json({
      success: true,
      count: employees.length,
      data: employees
    });
  } catch (error) {
    console.error('❌ Error fetching employees:', error.message);
    res.status(500).json({
      success: false,
      error: 'Server Error: Unable to fetch employees'
    });
  }
};

// @desc    Get single employee by ID
// @route   GET /api/employees/:id
const getEmployeeById = (req, res) => {
  try {
    const { id } = req.params;
    const { include_tasks } = req.query;

    let employee;
    if (include_tasks === 'true') {
      employee = Employee.getByIdWithTasks(id);
    } else {
      employee = Employee.getById(id);
    }

    if (!employee) {
      console.log(`⚠️ GET /api/employees/${id} - Not found`);
      return res.status(404).json({
        success: false,
        error: `Employee with ID ${id} not found`
      });
    }

    console.log(`📋 GET /api/employees/${id} - Found: ${employee.name}`);
    
    res.status(200).json({
      success: true,
      data: employee
    });
  } catch (error) {
    console.error('❌ Error fetching employee:', error.message);
    res.status(500).json({
      success: false,
      error: 'Server Error: Unable to fetch employee'
    });
  }
};

// @desc    Create new employee
// @route   POST /api/employees
const createEmployee = (req, res) => {
  try {
    const { name, role, email, avatar } = req.body;

    // Validation
    if (!name || !role || !email) {
      return res.status(400).json({
        success: false,
        error: 'Please provide name, role, and email'
      });
    }

    // Check if email already exists
    const existingEmployee = Employee.getByEmail(email);
    if (existingEmployee) {
      return res.status(400).json({
        success: false,
        error: 'Employee with this email already exists'
      });
    }

    const employee = Employee.create({ name, role, email, avatar });

    console.log(`✅ POST /api/employees - Created: ${employee.name}`);

    res.status(201).json({
      success: true,
      message: 'Employee created successfully',
      data: employee
    });
  } catch (error) {
    console.error('❌ Error creating employee:', error.message);
    res.status(500).json({
      success: false,
      error: 'Server Error: Unable to create employee'
    });
  }
};

// @desc    Update employee
// @route   PUT /api/employees/:id
const updateEmployee = (req, res) => {
  try {
    const { id } = req.params;
    const { name, role, email, avatar } = req.body;

    // Check if employee exists
    const existingEmployee = Employee.getById(id);
    if (!existingEmployee) {
      return res.status(404).json({
        success: false,
        error: `Employee with ID ${id} not found`
      });
    }

    // Check if new email already exists (for another employee)
    if (email && email !== existingEmployee.email) {
      const emailExists = Employee.getByEmail(email);
      if (emailExists) {
        return res.status(400).json({
          success: false,
          error: 'Email already in use by another employee'
        });
      }
    }

    const employee = Employee.update(id, { name, role, email, avatar });

    console.log(`✅ PUT /api/employees/${id} - Updated: ${employee.name}`);

    res.status(200).json({
      success: true,
      message: 'Employee updated successfully',
      data: employee
    });
  } catch (error) {
    console.error('❌ Error updating employee:', error.message);
    res.status(500).json({
      success: false,
      error: 'Server Error: Unable to update employee'
    });
  }
};

// @desc    Delete employee
// @route   DELETE /api/employees/:id
const deleteEmployee = (req, res) => {
  try {
    const { id } = req.params;

    // Check if employee exists
    const existingEmployee = Employee.getById(id);
    if (!existingEmployee) {
      return res.status(404).json({
        success: false,
        error: `Employee with ID ${id} not found`
      });
    }

    Employee.delete(id);

    console.log(`🗑️ DELETE /api/employees/${id} - Deleted: ${existingEmployee.name}`);

    res.status(200).json({
      success: true,
      message: 'Employee deleted successfully',
      data: {}
    });
  } catch (error) {
    console.error('❌ Error deleting employee:', error.message);
    res.status(500).json({
      success: false,
      error: 'Server Error: Unable to delete employee'
    });
  }
};

module.exports = {
  getAllEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  deleteEmployee
};