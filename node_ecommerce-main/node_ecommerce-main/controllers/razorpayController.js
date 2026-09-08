const Razorpay = require('razorpay');
const crypto = require('crypto');

const getRazorpayCredentials = () => {
  const keyId = process.env.RAZORPAY_KEY_ID?.trim();
  const keySecret = process.env.RAZORPAY_KEY_SECRET?.trim();

  if (!keyId || !keySecret || keyId.startsWith('your_') || keySecret.startsWith('your_')) {
    return null;
  }

  return { keyId, keySecret };
};

const getRazorpay = () => {
  const credentials = getRazorpayCredentials();
  if (!credentials) {
    const error = new Error('Razorpay credentials are not configured on the backend');
    error.code = 'RAZORPAY_CONFIGURATION_ERROR';
    throw error;
  }

  return new Razorpay({
    key_id: credentials.keyId,
    key_secret: credentials.keySecret,
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

    const credentials = getRazorpayCredentials();
    res.json({
      success: true,
      data: {
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        receipt: order.receipt,
        status: order.status,
        keyId: credentials.keyId,
      },
    });
  } catch (err) {
    console.error('Razorpay create order error:', err);
    res.status(500).json({
      success: false,
      error: err.code === 'RAZORPAY_CONFIGURATION_ERROR'
        ? err.message
        : 'Razorpay could not create the order',
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

    const credentials = getRazorpayCredentials();
    if (!credentials) {
      return res.status(503).json({
        success: false,
        error: 'Razorpay credentials are not configured on the backend',
      });
    }

    const expectedSignature = crypto
      .createHmac('sha256', credentials.keySecret)
      .update(body.toString())
      .digest('hex');

    const isAuthentic =
      expectedSignature.length === razorpay_signature.length &&
      crypto.timingSafeEqual(
        Buffer.from(expectedSignature),
        Buffer.from(razorpay_signature)
      );

    if (isAuthentic) {
      const credentials = getRazorpayCredentials();
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
        keyId: credentials.keyId,
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
