import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

const API_URL = 'http://localhost:5000/api/admin'

// Get auth token for requests
const getAuthHeader = () => {
  const token = localStorage.getItem('token')
  return {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }
}

const initialState = {
  users: [],
  todos: [],
  stats: {},
  recentUsers: [],
  recentTodos: [],
  isLoading: false,
  isError: false,
  message: ''
}

// Get all users
export const getUsers = createAsyncThunk(
  'admin/getUsers',
  async (_, thunkAPI) => {
    try {
      const response = await axios.get(`${API_URL}/users`, getAuthHeader())
      return response.data
    } catch (error) {
      const message = error.response?.data?.message || error.message
      return thunkAPI.rejectWithValue(message)
    }
  }
)

// Get all todos
export const getAllTodos = createAsyncThunk(
  'admin/getAllTodos',
  async (_, thunkAPI) => {
    try {
      const response = await axios.get(`${API_URL}/todos`, getAuthHeader())
      return response.data
    } catch (error) {
      const message = error.response?.data?.message || error.message
      return thunkAPI.rejectWithValue(message)
    }
  }
)

// Get dashboard stats
export const getDashboardStats = createAsyncThunk(
  'admin/getDashboardStats',
  async (_, thunkAPI) => {
    try {
      const response = await axios.get(`${API_URL}/stats`, getAuthHeader())
      return response.data
    } catch (error) {
      const message = error.response?.data?.message || error.message
      return thunkAPI.rejectWithValue(message)
    }
  }
)

// Update user role
export const updateUserRole = createAsyncThunk(
  'admin/updateUserRole',
  async ({ userId, role }, thunkAPI) => {
    try {
      const response = await axios.put(
        `${API_URL}/users/${userId}/role`,
        { role },
        getAuthHeader()
      )
      return response.data
    } catch (error) {
      const message = error.response?.data?.message || error.message
      return thunkAPI.rejectWithValue(message)
    }
  }
)

// Toggle user active status - FIXED VERSION
export const toggleUserActive = createAsyncThunk(
  'admin/toggleUserActive',
  async (userId, thunkAPI) => {
    try {
      const response = await axios.put(
        `${API_URL}/users/${userId}/toggle-active`,
        {},
        getAuthHeader()
      )
      return response.data // Now returning the full response data which includes user object
    } catch (error) {
      const message = error.response?.data?.message || error.message
      return thunkAPI.rejectWithValue(message)
    }
  }
)

export const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false
      state.isError = false
      state.message = ''
    }
  },
  extraReducers: (builder) => {
    builder
      // Get Users
      .addCase(getUsers.pending, (state) => {
        state.isLoading = true
        state.isError = false
        state.message = ''
      })
      .addCase(getUsers.fulfilled, (state, action) => {
        state.isLoading = false
        state.users = action.payload
      })
      .addCase(getUsers.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
      // Get All Todos
      .addCase(getAllTodos.pending, (state) => {
        state.isLoading = true
      })
      .addCase(getAllTodos.fulfilled, (state, action) => {
        state.isLoading = false
        state.todos = action.payload
        state.recentTodos = action.payload
      })
      .addCase(getAllTodos.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
      // Get Dashboard Stats
      .addCase(getDashboardStats.fulfilled, (state, action) => {
        state.stats = action.payload.stats || {}
        state.recentUsers = action.payload.recentUsers || []
        state.recentTodos = action.payload.recentTodos || []
      })
      // Update User Role
      .addCase(updateUserRole.fulfilled, (state, action) => {
        const updatedUser = action.payload.user
        const index = state.users.findIndex(user => user._id === updatedUser._id)
        if (index !== -1) {
          state.users[index] = updatedUser
        }
        // Also update in recentUsers if present
        const recentIndex = state.recentUsers.findIndex(user => user._id === updatedUser._id)
        if (recentIndex !== -1) {
          state.recentUsers[recentIndex] = updatedUser
        }
      })
      // Toggle User Active - FIXED
      .addCase(toggleUserActive.fulfilled, (state, action) => {
        const updatedUser = action.payload.user
        const index = state.users.findIndex(user => user._id === updatedUser._id)
        if (index !== -1) {
          state.users[index] = updatedUser
        }
        // Also update in recentUsers if present
        const recentIndex = state.recentUsers.findIndex(user => user._id === updatedUser._id)
        if (recentIndex !== -1) {
          state.recentUsers[recentIndex] = updatedUser
        }
      })
  }
})

export const { reset } = adminSlice.actions
export default adminSlice.reducer