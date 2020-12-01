const jwt = require('jsonwebtoken');

function verify(req, res, next){
   /// let accessToken = req.body.token

    //if there is no token stored in the req body token, the request is unauthorized
    if(!req.header.authorization){
        res.status(401).json({
            success: false,
            status: 401,
            message: "Unauthorized request"
        });
    }   

    let token = req.header.authorization.split(' ')[1];
    if(token === 'null'){
        res.status(401).json({
            success: false,
            status: 401,
            message: "Unauthorized request"
        });
    }

    let payload
    try{
        //use the jwt.verify method to verify the access token
        //throws an error if the token has expired or has a invalid signature
        let payload = jwt.verify(token, 'veegilmynamewayne');

        if(!payload){
            res.status(401).json({
                success: false,
                status: 401,
                message: "Unauthorized request"
            });
        }

        next();
    }
    catch(e){
        //if an error occured return request unauthorized error
        res.status(401).json({
            success: false,
            status: 401,
            message: "Unauthorized request"
        });
    }
}

module.exports = verify;


