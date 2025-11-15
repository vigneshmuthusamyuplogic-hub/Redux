import { useSelector, useDispatch } from 'react-redux'
import { logout } from '../store/slices/authSlice'
import { getTodos } from '../store/slices/todoSlice'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import TodoForm from '../components/TodoForm'
import TodoItem from '../components/TodoItem'

const Home = () => {
  const { user } = useSelector((state) => state.auth)
  const { todos, isLoading } = useSelector((state) => state.todos)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  useEffect(() => {
    dispatch(getTodos())
  }, [dispatch])

  const handleLogout = () => {
    dispatch(logout())
    navigate('/login')
  }

  // Ensure todos is always an array to prevent filter errors
  const todosArray = Array.isArray(todos) ? todos : []
  const completedTodos = todosArray.filter(todo => todo.completed)
  const pendingTodos = todosArray.filter(todo => !todo.completed)

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold">Contact Manager</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">Hello, {user?.username}</span>
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

      {/* Main Content */}
      <div className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Welcome Section */}
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Welcome to Your Contact Manager, {user?.username}!
            </h2>
            <p className="text-gray-600">
              Manage your contacts with ease. Add, edit, and organize your contacts with their mobile numbers.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white rounded-lg shadow p-4 text-center">
              <h3 className="text-lg font-semibold text-gray-900">Total Contacts</h3>
              <p className="text-3xl font-bold text-indigo-600">{todosArray.length}</p>
            </div>
            <div className="bg-white rounded-lg shadow p-4 text-center">
              <h3 className="text-lg font-semibold text-gray-900">Completed</h3>
              <p className="text-3xl font-bold text-green-600">{completedTodos.length}</p>
            </div>
            <div className="bg-white rounded-lg shadow p-4 text-center">
              <h3 className="text-lg font-semibold text-gray-900">Pending</h3>
              <p className="text-3xl font-bold text-yellow-600">{pendingTodos.length}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Add Todo Form */}
            <div className="lg:col-span-1">
              <TodoForm />
            </div>

            {/* Todo List */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow">
                <div className="p-6 border-b border-gray-200">
                  <h3 className="text-lg font-semibold">Your Contacts</h3>
                </div>

                <div className="p-6">
                  {isLoading ? (
                    <div className="text-center py-4">
                      <p className="text-gray-500">Loading contacts...</p>
                    </div>
                  ) : todosArray.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-gray-500">No contacts yet. Add your first contact above!</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {/* Pending Todos */}
                      {pendingTodos.length > 0 && (
                        <div>
                          <h4 className="font-medium text-gray-700 mb-3">Pending ({pendingTodos.length})</h4>
                          <div className="space-y-3">
                            {pendingTodos.map(todo => (
                              <TodoItem key={todo._id} todo={todo} />
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Completed Todos */}
                      {completedTodos.length > 0 && (
                        <div>
                          <h4 className="font-medium text-gray-700 mb-3 mt-6">Completed ({completedTodos.length})</h4>
                          <div className="space-y-3">
                            {completedTodos.map(todo => (
                              <TodoItem key={todo._id} todo={todo} />
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home