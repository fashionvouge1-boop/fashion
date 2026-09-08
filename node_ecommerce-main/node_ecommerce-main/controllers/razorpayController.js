const Razorpay = require('razorpay');
const crypto = require('crypto');

const getRazorpay = () => {
  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET ||
      process.env.RAZORPAY_KEY_ID.startsWith('your_') ||
      process.env.RAZORPAY_KEY_SECRET.startsWith('your_')) {
    throw new Error('Razorpay credentials are not configured');
  }

  return new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });
};

exports.createRazorpayOrder = async (req, res) => {
  try {
    const { amount, name, email, mobile, orderId } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        error: 'Invalid amount',
      });
    }

    const options = {
      amount: Math.round(amount * 100),
      currency: 'INR',
      receipt: orderId || `receipt_${Date.now()}`,
      payment_capture: 1,
      notes: {
        name: name || 'Customer',
        email: email || 'customer@example.com',
        mobile: mobile || 'NA',
      },
    };

    const order = await getRazorpay().orders.create(options);

    res.json({
      success: true,
      data: {
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        receipt: order.receipt,
        status: order.status,
        keyId: process.env.RAZORPAY_KEY_ID,
      },
    });
  } catch (err) {
    console.error('Razorpay create order error:', err);
    res.status(500).json({
      success: false,
      error: err.message || 'Failed to create Razorpay order',
    });
  }
};

exports.verifyRazorpayPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields',
      });
    }

    const body = razorpay_order_id + '|' + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest('hex');

    const isAuthentic = expectedSignature === razorpay_signature;

    if (isAuthentic) {
      res.json({
        success: true,
        message: 'Payment verified successfully',
        data: {
          razorpay_order_id,
          razorpay_payment_id,
          verified: true,
        },
      });
    } else {
      res.status(400).json({
        success: false,
        error: 'Invalid signature. Payment verification failed.',
      });
    }
  } catch (err) {
    console.error('Razorpay verify error:', err);
    res.status(500).json({
      success: false,
      error: err.message || 'Failed to verify payment',
    });
  }
};

exports.createRazorpayOrderOld = async (req, res) => {
  try {
    const {
      name,
      mobileNumber,
      amount,
      merchantkey,
      merchantid,
      domainName,
      orderAmount,
      customerPhone,
      customerName,
      customerEmail,
      customerId,
    } = req.body;

    const finalAmount = amount || orderAmount || 0;
    const finalName = name || customerName || 'Customer';
    const finalMobile = mobileNumber || customerPhone || '';
    const finalEmail = customerEmail || '';

    if (!finalAmount || finalAmount <= 0) {
      return res.status(400).json({
        success: false,
        error: 'Invalid amount',
      });
    }

    const options = {
      amount: Math.round(finalAmount * 100),
      currency: 'INR',
      receipt: `order_${Date.now()}`,
      payment_capture: 1,
      notes: {
        name: finalName,
        email: finalEmail,
        mobile: finalMobile,
      },
    };

    const order = await getRazorpay().orders.create(options);

    res.json({
      success: true,
      order_meta: {
        return_url: `#razorpay-order:${order.id}`,
      },
      data: {
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        keyId: process.env.RAZORPAY_KEY_ID,
        name: finalName,
        email: finalEmail,
        mobile: finalMobile,
      },
    });
  } catch (err) {
    console.error('Razorpay create order (old) error:', err);
    res.status(500).json({
      success: false,
      error: err.message || 'Failed to create order',
    });
  }
};
