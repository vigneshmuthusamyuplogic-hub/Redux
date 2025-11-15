import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

// Use the correct backend URL
const API_URL = 'http://localhost:5000/api/todos'

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
  todos: [],
  isLoading: false,
  isError: false,
  message: ''
}

// Get todos
export const getTodos = createAsyncThunk(
  'todos/getTodos',
  async (_, thunkAPI) => {
    try {
      const response = await axios.get(API_URL, getAuthHeader())
      return response.data
    } catch (error) {
      const message = error.response?.data?.message || error.message
      return thunkAPI.rejectWithValue(message)
    }
  }
)

// Create todo
export const createTodo = createAsyncThunk(
  'todos/createTodo',
  async (todoData, thunkAPI) => {
    try {
      console.log('Sending data:', todoData);
      const response = await axios.post('http://localhost:5000/api/todos', todoData, getAuthHeader())
      console.log('Response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Full error:', error);
      const message = error.response?.data?.message || error.message
      return thunkAPI.rejectWithValue(message)
    }
  }
)

// Update todo
export const updateTodo = createAsyncThunk(
  'todos/updateTodo',
  async ({ id, todoData }, thunkAPI) => {
    try {
      const response = await axios.put(`${API_URL}/${id}`, todoData, getAuthHeader())
      return response.data
    } catch (error) {
      const message = error.response?.data?.message || error.message
      return thunkAPI.rejectWithValue(message)
    }
  }
)

// Delete todo
export const deleteTodo = createAsyncThunk(
  'todos/deleteTodo',
  async (id, thunkAPI) => {
    try {
      await axios.delete(`${API_URL}/${id}`, getAuthHeader())
      return id
    } catch (error) {
      const message = error.response?.data?.message || error.message
      return thunkAPI.rejectWithValue(message)
    }
  }
)

export const todoSlice = createSlice({
  name: 'todos',
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
      // Get Todos
      .addCase(getTodos.pending, (state) => {
        state.isLoading = true
      })
      .addCase(getTodos.fulfilled, (state, action) => {
        state.isLoading = false
        state.todos = action.payload || []
      })
      .addCase(getTodos.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
        state.todos = []
      })
      // Create Todo
      .addCase(createTodo.fulfilled, (state, action) => {
        state.todos.unshift(action.payload)
      })
      .addCase(createTodo.rejected, (state, action) => {
        state.isError = true
        state.message = action.payload
      })
      // Update Todo
      .addCase(updateTodo.fulfilled, (state, action) => {
        const index = state.todos.findIndex(todo => todo._id === action.payload._id)
        if (index !== -1) {
          state.todos[index] = action.payload
        }
      })
      // Delete Todo
      .addCase(deleteTodo.fulfilled, (state, action) => {
        state.todos = state.todos.filter(todo => todo._id !== action.payload)
      })
  }
})

export const { reset } = todoSlice.actions
export default todoSlice.reducer