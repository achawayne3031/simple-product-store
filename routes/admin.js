const fs = require('fs');
const express = require('express');
const Joi = require('joi');
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

router.delete('/delete/:id', (req, res) => {
    res.set('Content-Type', 'json/application');

        Product.findById(req.params.id, (err, update) => {
            if(err){
                res.status(404).json({
                    success: false,
                    status: 404,
                    message: { message: "the id don't exist"}
                });
            }else{
                const path = './public/images/' + update.image;
                if (fs.existsSync(path)){
                    //file exists
                  //  fs.unlinkSync(path);   
                    fs.unlink(path, (err) => {
                        if (err) { 
                          res.status(403).json({
                              success: false,
                              status: 403,
                              message: { message: "something went wrong, try again"}
                          });
                        }
                    });  
                    
                }

                 /////////////////// Delete from database//////////////
                 Product.deleteOne({ _id: req.params.id }, function(err, result){
                    if(err){
                        res.status(404).json({
                            success: false,
                            status: 404,
                            message: { message: "the id don't exist"}
                        });
                    }else{
                        res.status(200).json({
                            success: true,
                            status: 200,
                            message: { result }
                        });
                    }
                });

            }

        });

});


router.put('/update/:id', upload.single('image'), (req, res) => {
   // res.set('Content-Type', 'json/application');
    const { error } = validateInput(req.body);
    if(error){
        res.status(400).json({
            success: false,
            status: 400,
            message: { error }
        });
        return;
    }

    pushUpdate();

    async function pushUpdate(){
        const update = await Product.findById(req.params.id);

            if(!update){
                res.status(404).json({
                    success: false,
                    status: 404,
                    message: { message: "the id don't exist"}
                });
                return;
            }

            if(req.file){
                const path = './public/images/' + update.image;
                if (fs.existsSync(path)){
                    //file exists
                    fs.unlink(path, (err) => {
                        if (err) { 
                            res.status(403).json({
                                success: false,
                                status: 403,
                                message: { message: "something went wrong, try again"}
                            });
                        }
                    });  
                }    
            }

            if(req.file){
                update.set({
                    title: req.body.title,
                    price: req.body.price,
                    category: req.body.category,
                    image: req.file.filename

                });
            }else{
                update.set({
                    title: req.body.title,
                    price: req.body.price,
                    category: req.body.category,
                    image: update.image

                });
            }
               

                const result = await update.save();
                res.status(200).json({
                    success: true,
                    status: 200,
                    message: { result }
                });

    }

});





function validateInput(data){
    const schema = {
        title: Joi.string().required(),
        price: Joi.number().required(),
        category: Joi.string().required()
    };
    return Joi.validate(data, schema);
}


module.exports = router;