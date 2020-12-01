
const express = require('express');
const baseJoi = require('joi');
const imageExtension = require('joi-image-extension');
const Joi = baseJoi.extend(imageExtension);
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const productSchema = require('../model/product');
const router = express.Router();


const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, 'public/images/');
    },

    filename: function(req, file, cb){
        let cusName = file.mimetype.split('/');
        cb(null, Date.now() + '.'+ cusName[1]);
    }
});

const fileFilter = (req, file, cb) => {
    if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/jpg'){
        cb(null, true);
    }else{
        cb(null, false);
    }
}

const upload = multer({
    storage: storage, 
    fileFilter: fileFilter
});


const Product = mongoose.model('Product', productSchema);

router.post('/add', upload.single('image'), (req, res) => {
    res.set('Content-Type', 'json/application');

    
    if(req.file){

        const { error } = validateInput(req.body);
        if(error){
            res.status(400).json({
                success: false,
                status: 400,
                message: { error }
            });
            return;
        }

    }else{
          res.status(400).json({
            success: false,
            status: 400,
            message: 'image is required'
        });
          return;
    }
    


    async function createProduct(){
        const product = new Product({
            title: req.body.title,
            price: req.body.price,
            category: req.body.category,
            image: req.file.filename
        });

        try{
            const result = await product.save(); 
            res.status(200).json({
                success: true,
                status: 200,
                data: { result }
            });
        }catch(ex){
            res.status(404).json({
                success: false,
                status: 404,
                message: { ex }
            });
           
        }

    }

    
 createProduct();

 

});


router.get('/get', (req, res) => {

     async function get(){
        try{
            const result = await Product
            .find()
            .sort({ date: 1});
             res.status(200).json({
                success: true,
                status: 200,
                data: { result },
            });
        }catch(ex){
            if(ex.message){
             //   res.status(400).send("error occur while running this process");
                res.status(404).json({
                success: false,
                status: 404,
                message: { ex }
            });
            }
        }
       
    }
   get();

});

router.get('/get/:id', (req, res) => {

     async function get(){
        try{
            const result = await Product
            .find({ _id: req.params.id});
             res.status(200).json({
                success: true,
                status: 200,
                data: { result },
            });
        }catch(ex){
            if(ex.message){
                res.status(404).json({
                success: false,
                status: 404,
                message: { ex }
            });
            }
        }
       
    }
   get();

});





function validateInput(data){
    
    const schema = {
        title: Joi.string().required(),
        price: Joi.number().required(),
        category: Joi.string().required(),
    };


    return Joi.validate(data, schema);
}





module.exports = router;