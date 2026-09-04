const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    id: Number,
    title: String,
    handle: String,
    body_html: String,
    published_at: Date,
    created_at: Date,
    updated_at: Date,
    vendor: String,
    product_type: String,
    tags: [String],
    variants: [Object],
    images: [Object],
    options: [Object]
}); // Ensure it uses the right Mongo collection name

module.exports = mongoose.model('products', productSchema);
