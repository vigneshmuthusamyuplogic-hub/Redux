const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Todo = require('../models/Todo');

// Create payment intent for 50 rupees (meets Stripe minimum)
exports.createPaymentIntent = async (req, res) => {
  try {
    console.log('Creating payment intent for 50 rupees');
    
    // Create a PaymentIntent with 50 rupees (5000 paise)
    const paymentIntent = await stripe.paymentIntents.create({
      amount: 5000, // 50 rupees in paise (meets minimum requirement)
      currency: 'inr',
      metadata: {
        userId: req.user.id.toString()
      }
    });

    console.log('Payment intent created:', paymentIntent.id);
    
    res.status(200).json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
      amount: 5000 // Send amount to frontend for display
    });
  } catch (error) {
    console.error('Stripe error:', error);
    res.status(500).json({ 
      message: 'Payment processing failed: ' + error.message
    });
  }
};

// Verify payment and create todo
exports.verifyPayment = async (req, res) => {
  try {
    const { paymentIntentId, title, mobileNumber } = req.body;

    console.log('Verifying payment:', paymentIntentId);
    
    // Retrieve payment intent from Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status !== 'succeeded') {
      return res.status(400).json({ 
        message: 'Payment not completed' 
      });
    }

    console.log('Payment successful, creating todo...');
    
    // Create the todo only after successful payment
    const todo = new Todo({
      title,
      mobileNumber,
      user: req.user._id,
      paymentIntentId: paymentIntentId,
      paymentAmount: 50, // 50 rupees
      paymentStatus: 'completed'
    });

    await todo.save();
    
    console.log('Todo created after payment:', todo._id);

    res.status(201).json({
      message: 'Contact added successfully',
      todo: todo
    });
  } catch (error) {
    console.error('Error in verifyPayment:', error);
    res.status(500).json({ 
      message: 'Failed to create contact: ' + error.message
    });
  }
};