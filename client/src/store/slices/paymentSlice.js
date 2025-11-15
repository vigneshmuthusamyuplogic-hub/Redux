import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

const API_URL = 'http://localhost:5000/api/payment'

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
  clientSecret: null,
  paymentIntentId: null,
  amount: 5000, // 50 rupees in paise
  isLoading: false,
  isError: false,
  message: ''
}

// Create payment intent
export const createPaymentIntent = createAsyncThunk(
  'payment/createPaymentIntent',
  async (_, thunkAPI) => {
    try {
      console.log('Creating payment intent for ₹50...');
      const response = await axios.post(
        `${API_URL}/create-payment-intent`, 
        {},
        getAuthHeader()
      )
      console.log('Payment intent created successfully');
      return response.data
    } catch (error) {
      console.error('Payment intent error:', error.response?.data);
      const message = error.response?.data?.message || error.message
      return thunkAPI.rejectWithValue(message)
    }
  }
)

// Verify payment and create todo
export const verifyPayment = createAsyncThunk(
  'payment/verifyPayment',
  async ({ paymentIntentId, title, mobileNumber }, thunkAPI) => {
    try {
      console.log('Verifying payment with data:', { paymentIntentId, title, mobileNumber });
      const response = await axios.post(
        `${API_URL}/verify-payment`, 
        { paymentIntentId, title, mobileNumber },
        getAuthHeader()
      )
      return response.data.todo
    } catch (error) {
      console.error('Verify payment error:', error.response?.data);
      const message = error.response?.data?.message || error.message
      return thunkAPI.rejectWithValue(message)
    }
  }
)

export const paymentSlice = createSlice({
  name: 'payment',
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false
      state.isError = false
      state.message = ''
    },
    clearPayment: (state) => {
      state.clientSecret = null
      state.paymentIntentId = null
    }
  },
  extraReducers: (builder) => {
    builder
      // Create Payment Intent
      .addCase(createPaymentIntent.pending, (state) => {
        state.isLoading = true
        state.isError = false
        state.message = ''
      })
      .addCase(createPaymentIntent.fulfilled, (state, action) => {
        state.isLoading = false
        state.clientSecret = action.payload.clientSecret
        state.paymentIntentId = action.payload.paymentIntentId
        state.amount = action.payload.amount || 5000
      })
      .addCase(createPaymentIntent.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
  }
})

export const { reset, clearPayment } = paymentSlice.actions
export default paymentSlice.reducer