import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { createPaymentIntent } from '../store/slices/paymentSlice'
import PaymentForm from './PaymentForm'

const TodoForm = () => {
  const [formData, setFormData] = useState({
    title: '',
    mobileNumber: ''
  })
  const [errors, setErrors] = useState({})
  const [showPayment, setShowPayment] = useState(false)

  const dispatch = useDispatch()
  const { isLoading: paymentLoading, amount } = useSelector((state) => state.payment)
  const { user } = useSelector((state) => state.auth)

  const { title, mobileNumber } = formData

  // Convert paise to rupees for display
  const amountInRupees = amount / 100;

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }))
    if (errors[e.target.name]) {
      setErrors(prev => ({ ...prev, [e.target.name]: '' }))
    }
  }

  const validateForm = () => {
    const newErrors = {}
    
    if (!title.trim()) {
      newErrors.title = 'Title is required'
    }
    
    if (!mobileNumber.trim()) {
      newErrors.mobileNumber = 'Mobile number is required'
    } else if (!/^[0-9]{10}$/.test(mobileNumber)) {
      newErrors.mobileNumber = 'Please enter a valid 10-digit mobile number'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) return

    // Check if user is authenticated
    if (!user) {
      setErrors({ submit: 'Please log in to add contacts' })
      return
    }

    try {
      // Create payment intent first
      await dispatch(createPaymentIntent()).unwrap()
      setShowPayment(true)
    } catch (error) {
      console.error('Failed to create payment intent:', error)
      if (error.includes('Stripe') || error.includes('payment')) {
        setErrors({ submit: 'Payment system error. Please try again.' })
      } else {
        setErrors({ submit: error })
      }
    }
  }

  const handlePaymentSuccess = () => {
    setFormData({ title: '', mobileNumber: '' })
    setShowPayment(false)
    setErrors({})
  }

  const handlePaymentCancel = () => {
    setShowPayment(false)
  }

  if (!user) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <div className="text-center py-8">
          <p className="text-gray-500">Please log in to add contacts</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h3 className="text-lg font-semibold mb-4">Add New Contact - ₹{amountInRupees}</h3>
        
        <div className="bg-blue-50 border border-blue-200 rounded-md p-3 mb-4">
          <p className="text-blue-800 text-sm">
            <strong>Payment Required:</strong> You need to pay ₹{amountInRupees} to add each contact
          </p>
          <p className="text-blue-700 text-xs mt-1">
            <em>Note: Minimum payment of ₹50 is required by payment processor</em>
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">
              Contact Name *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={title}
              onChange={onChange}
              className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 ${
                errors.title ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter contact name"
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-600">{errors.title}</p>
            )}
          </div>

          <div>
            <label htmlFor="mobileNumber" className="block text-sm font-medium text-gray-700">
              Mobile Number *
            </label>
            <input
              type="tel"
              id="mobileNumber"
              name="mobileNumber"
              value={mobileNumber}
              onChange={onChange}
              className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 ${
                errors.mobileNumber ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter 10-digit mobile number"
              maxLength="10"
            />
            {errors.mobileNumber && (
              <p className="mt-1 text-sm text-red-600">{errors.mobileNumber}</p>
            )}
          </div>

          {errors.submit && (
            <div className="text-red-600 text-sm bg-red-50 p-2 rounded">{errors.submit}</div>
          )}

          <button
            type="submit"
            disabled={paymentLoading}
            className="w-full bg-green-600 text-white py-3 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 font-semibold"
          >
            {paymentLoading ? 'Preparing Payment...' : `Proceed to Pay ₹${amountInRupees}`}
          </button>
        </form>
      </div>

      {showPayment && (
        <PaymentForm
          todoData={formData}
          onSuccess={handlePaymentSuccess}
          onCancel={handlePaymentCancel}
        />
      )}
    </>
  )
}

export default TodoForm