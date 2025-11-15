import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { updateTodo, deleteTodo } from '../store/slices/todoSlice'

const TodoItem = ({ todo }) => {
  const [isEditing, setIsEditing] = useState(false)
  const [editData, setEditData] = useState({
    title: todo.title,
    mobileNumber: todo.mobileNumber
  })

  const dispatch = useDispatch()

  const handleEdit = () => {
    setIsEditing(true)
    setEditData({
      title: todo.title,
      mobileNumber: todo.mobileNumber
    })
  }

  const handleCancel = () => {
    setIsEditing(false)
    setEditData({
      title: todo.title,
      mobileNumber: todo.mobileNumber
    })
  }

  const handleSave = () => {
    dispatch(updateTodo({ id: todo._id, todoData: editData }))
      .unwrap()
      .then(() => {
        setIsEditing(false)
      })
      .catch((error) => {
        console.error('Failed to update todo:', error)
      })
  }

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this contact?')) {
      dispatch(deleteTodo(todo._id))
    }
  }

  const handleToggleComplete = () => {
    dispatch(updateTodo({ 
      id: todo._id, 
      todoData: { completed: !todo.completed } 
    }))
  }

  return (
    <div className={`bg-white p-4 rounded-lg shadow border-l-4 ${
      todo.completed ? 'border-green-500 bg-green-50' : 'border-blue-500'
    }`}>
      {!isEditing ? (
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h4 className={`font-medium ${todo.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
              {todo.title}
            </h4>
            <p className={`text-sm ${todo.completed ? 'text-gray-400' : 'text-gray-600'}`}>
              📱 {todo.mobileNumber}
            </p>
            <div className="flex items-center mt-1 text-xs text-gray-400">
              <span>Created: {new Date(todo.createdAt).toLocaleDateString()}</span>
              {todo.paymentStatus === 'completed' && (
                <span className="ml-2 text-green-600 flex items-center">
                  • Paid ₹{todo.paymentAmount || 10}
                </span>
              )}
            </div>
          </div>
          
          <div className="flex items-center space-x-2 ml-4">
            <button
              onClick={handleToggleComplete}
              className={`px-3 py-1 text-xs rounded ${
                todo.completed 
                  ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200' 
                  : 'bg-green-100 text-green-800 hover:bg-green-200'
              }`}
            >
              {todo.completed ? 'Undo' : 'Complete'}
            </button>
            
            <button
              onClick={handleEdit}
              className="px-3 py-1 text-xs bg-blue-100 text-blue-800 rounded hover:bg-blue-200"
            >
              Edit
            </button>
            
            <button
              onClick={handleDelete}
              className="px-3 py-1 text-xs bg-red-100 text-red-800 rounded hover:bg-red-200"
            >
              Delete
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          <input
            type="text"
            value={editData.title}
            onChange={(e) => setEditData(prev => ({ ...prev, title: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Enter title"
          />
          <input
            type="tel"
            value={editData.mobileNumber}
            onChange={(e) => setEditData(prev => ({ ...prev, mobileNumber: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Enter mobile number"
            maxLength="10"
          />
          <div className="flex space-x-2">
            <button
              onClick={handleSave}
              className="flex-1 bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700"
            >
              Save
            </button>
            <button
              onClick={handleCancel}
              className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default TodoItem