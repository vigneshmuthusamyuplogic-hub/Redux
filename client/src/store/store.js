import { configureStore } from '@reduxjs/toolkit'
import authReducer from './slices/authSlice'
import todoReducer from './slices/todoSlice'
import paymentReducer from './slices/paymentSlice'
import adminReducer from './slices/adminSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    todos: todoReducer,
    payment: paymentReducer,
    admin: adminReducer,
  },
})