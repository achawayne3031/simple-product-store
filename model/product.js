
const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    category: {
        type: String,
        required: true,
        enum: ['laptop', 'phones', 'watches', 'electronics', 'gaming']
    },
    image: {
        type: String,
        required: true
    },
    date: { 
        type: Date, 
        default: Date.now
    }
});

module.exports = productSchema;