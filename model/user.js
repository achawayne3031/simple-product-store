const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    email: {
        type: String,
        minlength: 5,
        maxlength: 200,
        required: true,
        lowercase: true
    },
    password: {
        type: String,
        minlength: 5,
        maxlength: 200,
        required: true,
        lowercase: true
    },
    position: {
        type: String,
        required: true,
        enum: ['admin', 'user']
    },
    date: { 
        type: Date, 
        default: Date.now
    }
});

module.exports = userSchema;