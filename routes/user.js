
const express = require('express');
const Joi = require('joi');
var passwordHash = require('password-hash');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const base64 = require('base64url');
const userSchema = require('../model/user');
const router = express.Router();

const verify = require('../middleware/auth');

const User = mongoose.model('User', userSchema);

router.post('/login', (req, res) => {
      res.set('Content-Type', 'json/application');

    const { error } = validateLoginIput(req.body);
    if(error){
        res.status(404).json({
            success: false,
            status: 404,
            message: error
        });
        return;
    }

    User.find({email: req.body.email})
            .select({ email: 1, password: 1, _id: 1, position: 1 })
            .then(result => {
                if(result.length){
                    if(req.body.email == result[0].email){
                        if(passwordHash.verify(req.body.password, result[0].password)){
                            var tokenValue = {
                                id: result[0]._id,
                                position: result[0].position
                            }
                            
                           let accessToken = jwt.sign(tokenValue, 'veegilmynamewayne', {algorithm: "HS256"})
                            if(req.body.cookie == 1){
                                res.cookie('remember', accessToken, { maxAge: 900000, httpOnly: true })
                            }else{
                                res.json(accessToken)
                            }

                            
                        }else{
                            res.status(404).json({
                                success: false,
                                status: 404,
                                message: 'Invalid password'
                            });
                            
                        }
                    }else{
                        res.status(404).json({
                            success: false,
                            status: 404,
                            message: 'email address not registered'
                        });
     
                    }
                
                }else{
                    res.status(404).json({
                        success: false,
                        status: 404,
                        message: 'email address not registered'
                    });
                }
            }, err => {
                res.status(404).json({
                    success: false,
                    status: 404,
                    message: err
                });
            })
            .catch(ex => {
                res.status(500).json({
                    success: false,
                    status: 500,
                    message: ex
                });

            });

});




router.post('/signup', (req, res) => {
    res.set('Content-Type', 'json/application')

    var email = req.body.email;
    var password = req.body.password;
    var position = req.body.position;

    const { error } = validateInput(req.body);
    if(error){
       // res.status(400).send(`{ "success" false, "status": 404, {"message": ${error}}`);
        res.status(404).json({
            success: false,
            status: 404,
            message: error.message
        });
        return;
    }
    
    var hashedPassword = passwordHash.generate(password);

    findEmail();
        /////////// check de database if email exits////
        async function findEmail(){
            try{
                const user = await User
                .find({email: req.body.email })
                if(user.length > 0){
                    res.status(403).json({
                        success: false,
                        status: 403,
                        message: `The email ${req.body.email} has already been registered`
                    });
                }else{
                    createUser();
                }
                
            }catch(ex){
                if(ex.message){
                    res.status(500).json({
                        success: false,
                        status: 500,
                        message: { ex }
                    });
                }
            }
        }


    async function createUser(){
        const users = new User({
            email: req.body.email,
            password: hashedPassword,
            position: req.body.position
        });

        try{
            const result = await users.save();
            var tokenValue = {
                id: result._id,
                position: result.position
            }
            
           let accessToken = jwt.sign(tokenValue, 'veegilmynamewayne', {algorithm: "HS256"})
            
            res.status(200).json({
                success: true,
                status: 200,
                data: { result },
                token: accessToken
            });
        }catch(ex){
            res.status(404).json({
                success: false,
                status: 404,
                message: { ex }
            });
            /*
            for(fields in ex.errors){
                
             //   res.status(404).send(`{"success": false, "status": 404, {"message": ${ex.errors[fields].message}}`);
            }
            */
        }

    }


});


router.post('/check', (req, res) => {

    jwt.verify(req.body.token, 'veegilmynamewayne', function(err, decoded) {
       // console.log(decoded) // bar
     //  console.log(req.body.token);
        if(err){
             res.status(404).json({
                success: false,
                status: 404,
                message: { err }
            });
        }else{
             res.status(200).json({
                success: true,
                status: 200,
                data: { decoded }
            });
        }
       
    });

    /*
    const jwtUrl = req.body.token;
    const jwtParts = jwtUrl.split('.');
    const payloadInBase64UrlFormat = jwtParts[1];
    const decodedPayload = base64.decode(payloadInBase64UrlFormat);
   // console.log(decodedPayload);
    res.send(decodedPayload);
    */
});



function validateInput(data){
    const schema = {
        email: Joi.string().email().required(),
        password: Joi.string().min(5).required(),
        position: Joi.string().required()
    };

    return Joi.validate(data, schema);
}

function validateLoginIput(data) {
    const schema = {
        email: Joi.string().email().required(),
        password: Joi.string().min(5).required()
    };

    return Joi.validate(data, schema);
}



module.exports = router;
