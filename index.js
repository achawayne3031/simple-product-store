const express = require('express');
const Joi = require('joi');
const helmet = require('helmet');
var jwt = require("jsonwebtoken");
var passwordHash = require('password-hash');
var mongoose = require('mongoose');
const user = require('./routes/user');
const product = require('./routes/product');
const admin = require('./routes/admin');
const app = express();


app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST,OPTIONS,DELETE,PUT');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization, Content-Type, Accept');
    next();
});




app.use(express.static('/public'));
app.use('/api/user', user);
app.use('/api/product', product);
app.use('/api/admin', admin);


mongoose.connect("mongodb://localhost/veegil")
        .then(() => { console.log("database connected"); })
        .catch(() => { res.status(404).send("database connection not successful", err); });



app.post('/', (req, res) => {
    console.log(req.body);
});



process.on('uncaughtException', function(err) {
    console.log(err);
});

const port = process.env.PORT || 3000;
app.listen(port);
console.log(`server on port ${port}`);