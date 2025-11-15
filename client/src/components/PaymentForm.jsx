import { useState } from 'react'
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js'
import { useDispatch, useSelector } from 'react-redux'
import { verifyPayment, clearPayment } from '../store/slices/paymentSlice'
import { getTodos } from '../store/slices/todoSlice'

const PaymentForm = ({ todoData, onSuccess, onCancel }) => {
  const stripe = useStripe()
  const elements = useElements()
  const dispatch = useDispatch()
  
  const { clientSecret, paymentIntentId, amount, isLoading } = useSelector((state) => state.payment)
  const [error, setError] = useState('')
  const [processing, setProcessing] = useState(false)

  // Convert paise to rupees for display
  const amountInRupees = amount / 100;

  const cardStyle = {
    style: {
      base: {
        color: '#32325d',
        fontFamily: 'Arial, sans-serif',
        fontSmoothing: 'antialiased',
        fontSize: '16px',
        '::placeholder': {
          color: '#aab7c4',
        },
      },
      invalid: {
        color: '#fa755a',
        iconColor: '#fa755a',
      },
    },
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    
    if (!stripe || !elements) {
      setError('Stripe not loaded')
      return
    }

    setProcessing(true)
    setError('')

    const card = elements.getElement(CardElement)

    try {
      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: card,
        },
      })

      if (stripeError) {
        setError(stripeError.message)
        setProcessing(false)
        return
      }

      if (paymentIntent.status === 'succeeded') {
        console.log('Payment successful, creating contact...');
        
        // Verify payment with backend and create todo
        dispatch(verifyPayment({ 
          paymentIntentId, 
          title: todoData.title, 
          mobileNumber: todoData.mobileNumber 
        }))
          .unwrap()
          .then((newTodo) => {
            console.log('Contact created after payment:', newTodo);
            // Refresh todos list
            dispatch(getTodos())
            // Clear payment data
            dispatch(clearPayment())
            // Show success
            onSuccess()
          })
          .catch((error) => {
            console.error('Failed to create contact after payment:', error);
            setError('Payment successful but failed to create contact: ' + error)
          })
          .finally(() => {
            setProcessing(false)
          })
      }
    } catch (err) {
      console.error('Payment error:', err);
      setError('Payment failed. Please try again.')
      setProcessing(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h3 className="text-lg font-semibold mb-4">Pay ₹{amountInRupees} to Add Contact</h3>
        <div className="bg-blue-50 border border-blue-200 rounded-md p-3 mb-4">
          <p className="text-blue-800 text-sm">
            <strong>Contact Details:</strong> {todoData.title} - {todoData.mobileNumber}
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Card Details
            </label>
            <div className="border rounded-md p-3">
              <CardElement options={cardStyle} />
            </div>
          </div>
          
          {error && (
            <div className="text-red-600 text-sm bg-red-50 p-2 rounded">{error}</div>
          )}
          
          <div className="flex space-x-3">
            <button
              type="button"
              onClick={onCancel}
              disabled={processing}
              className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!stripe || processing || isLoading}
              className="flex-1 bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 disabled:opacity-50"
            >
              {processing ? 'Processing...' : `Pay ₹${amountInRupees}`}
            </button>
          </div>
        </form>
        
        <div className="mt-4 p-3 bg-gray-50 rounded-md">
          <p className="text-xs text-gray-600 font-semibold mb-2">TEST MODE - Use these card details:</p>
          <div className="text-xs text-gray-500 space-y-1">
            <p>Card: <span className="font-mono">4242 4242 4242 4242</span></p>
            <p>Exp: 12/34 | CVC: 123 | ZIP: 12345</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PaymentForm