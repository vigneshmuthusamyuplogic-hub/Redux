const express = require('express');
const { body } = require('express-validator');
const todoController = require('../controllers/todoController');
const auth = require('../middleware/auth');

const router = express.Router();

// Validation rules
const todoValidation = [
  body('title')
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ max: 100 })
    .withMessage('Title must be less than 100 characters'),
  body('mobileNumber')
    .matches(/^[0-9]{10}$/)
    .withMessage('Please enter a valid 10-digit mobile number')
];

// All routes require authentication
router.use(auth);

router.get('/', todoController.getTodos);
router.post('/', todoValidation, todoController.createTodo);
router.put('/:id', todoValidation, todoController.updateTodo);
router.delete('/:id', todoController.deleteTodo);

module.exports = router;