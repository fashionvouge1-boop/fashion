const mongoose = require('mongoose');

const bankGatewayInfoSchema = new mongoose.Schema(
    {
        id: Number,
        gateway_id: String,
        app_id: String,
        app_secret: String,
        test_app_id: String,
        test_app_secret: String,
        daily_limit: Number,
        monthly_limit: Number,
        domin_id: Number,
        active: Boolean,
        isProd: Boolean,
        bankName: String,
        bankHolderName: String,
        accountNumber: String,
        ifscCode: String,
        branch: String,
        accountType: String,
        gateway_test_url: String,
        gateway_prod_url: String,
        redirect_success_url: String,
        redirect_fail_url: String
    },
    { timestamps: true }
);

module.exports = mongoose.model('bankGatewayInfo', bankGatewayInfoSchema);
