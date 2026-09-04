const mongoose = require('mongoose');

const gatewayInfoSchema = new mongoose.Schema({
    id: Number,
    gateway_name: String,
    title: String,
    active: Boolean
});

module.exports = mongoose.model('gatewayInfo', gatewayInfoSchema);