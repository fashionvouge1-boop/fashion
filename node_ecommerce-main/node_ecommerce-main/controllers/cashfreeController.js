const axios = require("axios");
const PaymentGateway = require('../models/PaymentGateway');

exports.getActiveGatewayByDomain = async (dominId) => {
    try {
        const gateway = await PaymentGateway.findOne({
            domin_id: dominId,
            active: true
        });

        if (!gateway) {
            console.log(`No active gateway found for domain id ${dominId}`);
            return null;
        }
        return gateway;
    } catch (err) {
        console.error('Error fetching gateway:', err.message);
        return null;
    }
};

exports.createOrder = async (req, res) => {
    try {
        const { orderAmount, customerPhone, customerName, customerEmail, dominId } = req.body;
        const activeGateway = await exports.getActiveGatewayByDomain(dominId);

        if (!activeGateway) {
            return res.status(503).json({
                success: false,
                error: 'No active payment gateway is configured for this domain',
            });
        }

        // Dynamically import uuid (ES Module) in a CommonJS file
        const { v4: uuidv4 } = await import('uuid');
        const orderPayload = {
            order_id: "order_" + Date.now(),
            order_amount: orderAmount,
            order_currency: "INR",
            customer_details: {
                customer_id: 'CUST-' + uuidv4(),
                customer_phone: customerPhone,
                customer_name: customerName,
                customer_email: customerEmail,
            },
            order_meta: {
                return_url: `${activeGateway?.redirect_success_url}?order_id=${"order_" + Date.now()}`,
            },
        };
        const response = await axios.post(
            `${activeGateway?.isProd ? activeGateway?.gateway_prod_url : activeGateway?.gateway_test_url}/orders`,
            orderPayload,
            {
                headers: {
                    "Content-Type": "application/json",
                    "x-client-id": activeGateway?.isProd ? activeGateway?.app_id : activeGateway?.test_app_id,
                    "x-client-secret": activeGateway?.isProd ? activeGateway?.app_secret : activeGateway?.test_app_secret,
                    "x-api-version": "2023-08-01",
                },
            }
        );
        res.json({
            success: true,
            data: response.data,
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            error: err.response?.data || "Something went wrong",
        });
    }
};
