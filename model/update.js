
const mongoose = require('mongoose');

const updateSchema = mongoose.Schema({
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
    }
});

module.exports = updateSchema;