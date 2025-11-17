const User = require('../models/User');
const Todo = require('../models/Todo');

// Get all users (admin only)
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    console.error('Error in getUsers:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all todos (admin only)
exports.getAllTodos = async (req, res) => {
  try {
    const todos = await Todo.find()
      .populate('user', 'username email')
      .sort({ createdAt: -1 });
    res.json(todos);
  } catch (error) {
    console.error('Error in getAllTodos:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update user role (admin only)
exports.updateUserRole = async (req, res) => {
  try {
    const { userId } = req.params;
    const { role } = req.body;

    console.log(`Updating user ${userId} role to ${role}`);

    if (!['user', 'admin'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role' });
    }

    // Prevent admin from changing their own role
    if (userId === req.user._id.toString()) {
      return res.status(400).json({ message: 'Cannot change your own role' });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { role },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    console.log(`Successfully updated user ${userId} role to ${role}`);
    res.json({ 
      message: 'User role updated successfully', 
      user 
    });
  } catch (error) {
    console.error('Error in updateUserRole:', error);
    res.status(500).json({ 
      message: 'Failed to update user role', 
      error: error.message 
    });
  }
};

// Toggle user active status (admin only) - FIXED VERSION
exports.toggleUserActive = async (req, res) => {
  try {
    const { userId } = req.params;

    console.log(`Toggling active status for user: ${userId}`);

    // Prevent admin from deactivating themselves
    if (userId === req.user._id.toString()) {
      return res.status(400).json({ message: 'Cannot deactivate your own account' });
    }

    // Find the user first
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Toggle the isActive status
    const newActiveStatus = !user.isActive;
    
    // Update the user
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { isActive: newActiveStatus },
      { new: true, runValidators: true }
    ).select('-password');

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found after update' });
    }

    console.log(`Successfully ${newActiveStatus ? 'activated' : 'deactivated'} user: ${userId}`);

    res.json({ 
      message: `User ${newActiveStatus ? 'activated' : 'deactivated'} successfully`,
      user: updatedUser
    });
  } catch (error) {
    console.error('Error in toggleUserActive:', error);
    res.status(500).json({ 
      message: 'Failed to update user status', 
      error: error.message 
    });
  }
};

// Get dashboard stats (admin only)
exports.getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalAdmins = await User.countDocuments({ role: 'admin' });
    const totalTodos = await Todo.countDocuments();
    
    const totalRevenueResult = await Todo.aggregate([
      { $match: { paymentStatus: 'completed' } },
      { $group: { _id: null, total: { $sum: '$paymentAmount' } } }
    ]);

    const recentUsers = await User.find()
      .select('-password')
      .sort({ createdAt: -1 })
      .limit(5);

    const recentTodos = await Todo.find()
      .populate('user', 'username email')
      .sort({ createdAt: -1 })
      .limit(10);

    res.json({
      stats: {
        totalUsers,
        totalAdmins,
        totalTodos,
        totalRevenue: totalRevenueResult[0]?.total || 0
      },
      recentUsers,
      recentTodos
    });
  } catch (error) {
    console.error('Error in getDashboardStats:', error);
    res.status(500).json({ 
      message: 'Failed to get dashboard stats', 
      error: error.message 
    });
  }
};