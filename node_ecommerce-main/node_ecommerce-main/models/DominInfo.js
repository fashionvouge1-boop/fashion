const mongoose = require('mongoose');

const dominInfoSchema = new mongoose.Schema({
    id: Number,
    domin_name: String,
    weburl: String,
    title: String,
    active: Boolean
});

module.exports = mongoose.model('dominInfo', dominInfoSchema);