import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { logout } from '../store/slices/authSlice'
import { getUsers, getDashboardStats, updateUserRole, toggleUserActive, getAllTodos } from '../store/slices/adminSlice'
import { useNavigate } from 'react-router-dom'

const AdminDashboard = () => {
  const { user: adminUser } = useSelector((state) => state.auth)
  const { users, stats, recentUsers, recentTodos, isLoading } = useSelector((state) => state.admin)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('dashboard')
  const [updatingUserId, setUpdatingUserId] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    dispatch(getDashboardStats())
    if (activeTab === 'users') {
      dispatch(getUsers())
    }
    if (activeTab === 'todos') {
      dispatch(getAllTodos())
    }
  }, [dispatch, activeTab])

  const handleLogout = () => {
    dispatch(logout())
    navigate('/login')
  }

  const clearError = () => {
    setError('')
  }

  const handleRoleChange = async (userId, newRole) => {
    setUpdatingUserId(userId)
    clearError()
    try {
      await dispatch(updateUserRole({ userId, role: newRole })).unwrap()
    } catch (error) {
      console.error('Failed to update role:', error)
      setError('Failed to update user role: ' + error)
    } finally {
      setUpdatingUserId(null)
    }
  }

  const handleToggleActive = async (userId) => {
    clearError()
    try {
      await dispatch(toggleUserActive(userId)).unwrap()
    } catch (error) {
      console.error('Failed to toggle user status:', error)
      setError('Failed to update user status: ' + error)
    }
  }

  if (!adminUser || adminUser.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h2>
          <p className="text-gray-600">You need admin privileges to access this page.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold">Admin Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">Admin: {adminUser.username}</span>
              <button
                onClick={() => navigate('/')}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                User View
              </button>
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Error Message */}
      {error && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <div className="text-red-400">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">Error</h3>
                  <p className="text-sm text-red-700 mt-1">{error}</p>
                </div>
              </div>
              <button
                onClick={clearError}
                className="text-red-400 hover:text-red-600"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'dashboard'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Dashboard
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'users'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              User Management
            </button>
            <button
              onClick={() => setActiveTab('todos')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'todos'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              All Contacts
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          
          {/* Dashboard Tab */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              {/* Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white rounded-lg shadow p-4 text-center">
                  <h3 className="text-lg font-semibold text-gray-900">Total Users</h3>
                  <p className="text-3xl font-bold text-indigo-600">{stats.totalUsers || 0}</p>
                </div>
                <div className="bg-white rounded-lg shadow p-4 text-center">
                  <h3 className="text-lg font-semibold text-gray-900">Admins</h3>
                  <p className="text-3xl font-bold text-green-600">{stats.totalAdmins || 0}</p>
                </div>
                <div className="bg-white rounded-lg shadow p-4 text-center">
                  <h3 className="text-lg font-semibold text-gray-900">Total Contacts</h3>
                  <p className="text-3xl font-bold text-blue-600">{stats.totalTodos || 0}</p>
                </div>
                <div className="bg-white rounded-lg shadow p-4 text-center">
                  <h3 className="text-lg font-semibold text-gray-900">Total Revenue</h3>
                  <p className="text-3xl font-bold text-purple-600">₹{stats.totalRevenue || 0}</p>
                </div>
              </div>

              {/* Recent Users */}
              <div className="bg-white rounded-lg shadow">
                <div className="p-6 border-b border-gray-200">
                  <h3 className="text-lg font-semibold">Recent Users</h3>
                </div>
                <div className="p-6">
                  {recentUsers.length === 0 ? (
                    <p className="text-gray-500">No users yet.</p>
                  ) : (
                    <div className="space-y-4">
                      {recentUsers.map(user => (
                        <div key={user._id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <p className="font-medium">{user.username}</p>
                            <p className="text-sm text-gray-500">{user.email}</p>
                            <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                              user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'
                            }`}>
                              {user.role}
                            </span>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-gray-400">
                              Joined: {new Date(user.createdAt).toLocaleDateString()}
                            </p>
                            <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                              user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}>
                              {user.isActive ? 'Active' : 'Inactive'}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Users Management Tab */}
          {activeTab === 'users' && (
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold">User Management</h3>
                <p className="text-sm text-gray-500 mt-1">
                  Manage user roles and account status. You cannot change your own role or deactivate your own account.
                </p>
              </div>
              <div className="p-6">
                {isLoading ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500">Loading users...</p>
                  </div>
                ) : users.length === 0 ? (
                  <p className="text-gray-500">No users found.</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            User
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Role
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Joined
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {users.map(user => (
                          <tr key={user._id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div>
                                <p className="font-medium text-gray-900">{user.username}</p>
                                <p className="text-sm text-gray-500">{user.email}</p>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <select
                                value={user.role}
                                onChange={(e) => handleRoleChange(user._id, e.target.value)}
                                disabled={user._id === adminUser.id || updatingUserId === user._id}
                                className={`border rounded px-3 py-2 text-sm ${
                                  user.role === 'admin' ? 'bg-purple-50 text-purple-700' : 'bg-gray-50 text-gray-700'
                                } ${(user._id === adminUser.id || updatingUserId === user._id) ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                              >
                                <option value="user">User</option>
                                <option value="admin">Admin</option>
                              </select>
                              {updatingUserId === user._id && (
                                <span className="ml-2 text-xs text-blue-500">Updating...</span>
                              )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                                user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                              }`}>
                                {user.isActive ? 'Active' : 'Inactive'}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {new Date(user.createdAt).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                              <button
                                onClick={() => handleToggleActive(user._id)}
                                disabled={user._id === adminUser.id}
                                className={`px-3 py-1 text-xs rounded font-medium ${
                                  user.isActive 
                                    ? 'bg-red-100 text-red-800 hover:bg-red-200' 
                                    : 'bg-green-100 text-green-800 hover:bg-green-200'
                                } ${user._id === adminUser.id ? 'opacity-50 cursor-not-allowed' : ''}`}
                              >
                                {user.isActive ? 'Deactivate' : 'Activate'}
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* All Contacts Tab */}
          {activeTab === 'todos' && (
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold">All Contacts ({recentTodos.length})</h3>
                <p className="text-sm text-gray-500 mt-1">
                  View all contacts created by all users in the system.
                </p>
              </div>
              <div className="p-6">
                {recentTodos.length === 0 ? (
                  <p className="text-gray-500">No contacts found.</p>
                ) : (
                  <div className="space-y-4">
                    {recentTodos.map(todo => (
                      <div key={todo._id} className="border rounded-lg p-4 hover:bg-gray-50">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900">{todo.title}</h4>
                            <p className="text-sm text-gray-600 mt-1">📱 {todo.mobileNumber}</p>
                            <div className="mt-2 flex items-center space-x-4 text-xs text-gray-500">
                              <span>
                                Created by: <strong>{todo.user?.username}</strong> ({todo.user?.email})
                              </span>
                              <span>•</span>
                              <span>
                                Role: <span className={`px-1 rounded ${
                                  todo.user?.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'
                                }`}>
                                  {todo.user?.role}
                                </span>
                              </span>
                            </div>
                            <p className="text-xs text-gray-400 mt-2">
                              Date: {new Date(todo.createdAt).toLocaleString()}
                            </p>
                          </div>
                          <div className="text-right ml-4">
                            <span className="inline-block px-2 py-1 text-xs bg-green-100 text-green-800 rounded font-medium">
                              Paid ₹{todo.paymentAmount || 50}
                            </span>
                            <p className={`text-xs mt-1 ${
                              todo.completed ? 'text-green-600' : 'text-yellow-600'
                            }`}>
                              Status: {todo.completed ? 'Completed' : 'Pending'}
                            </p>
                            <p className="text-xs text-gray-400 mt-1">
                              Payment ID: {todo.paymentIntentId?.substring(0, 8)}...
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard