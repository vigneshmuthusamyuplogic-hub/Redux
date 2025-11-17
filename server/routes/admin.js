const express = require('express');
const adminController = require('../controllers/adminController');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

const router = express.Router();

// All routes require admin authentication
router.use(auth);
router.use(admin);

router.get('/users', adminController.getUsers);
router.get('/todos', adminController.getAllTodos);
router.get('/stats', adminController.getDashboardStats);
router.put('/users/:userId/role', adminController.updateUserRole);
router.put('/users/:userId/toggle-active', adminController.toggleUserActive);

module.exports = router;