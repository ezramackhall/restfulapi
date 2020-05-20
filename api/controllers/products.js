const Product = require('../models/product');
const mongoose = require('mongoose');

exports.products_get_all= (req, res, next) => {
    Product.find()
        .select('name price _id productImage')
        .exec()
        .then(docs => {
            const response = {
                count: docs.length,
                products: docs.map(doc => {
                    return {
                        name: doc.name,
                        price: doc.price,
                        _id: doc._id,
                        productImage: doc.productImage,
                        request: {
                            type:'GET',
                            url: 'http://localhost:8080/products/' + doc._id
                        }
                    }
                })
            };
            res.status(200).json(response);
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({
                Message: err
            })
        })
};

exports.products_post = (req, res, next) => {
    console.log(req.file);
    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price,
        productImage: req.file.path
    });
    product.save()
        .then(result => {
            console.log(result);
            res.status(201).json({
                message: 'Created Product successfully',
                createdProduct: {
                    name: result.name,
                    price: result.price,
                    _id: result._id,
                    productImage: result.productImage,
                    request: {
                        type:'GET',
                        url: 'http://localhost:8080/products/' + result._id
                    }
                }
            });
        })
        .catch(err => {
                console.log(err);
                res.status(500).json({
                    error: err
                })
            }
        );
};

exports.products_get_singular = (req, res, next) => {
    const id = req.params.productId;
    Product.findById(id)
        .select(' name price _id productImage')
        .exec()
        .then(doc => {
            console.log(doc);
            if(doc) {
                res.status(200).json({doc});
            }else {
                res.status(404).json({ Message: 'No Valid Entry Found'});
            }

        })
        .catch(err => {
            console.log(err);
            res.status(500).json({error: err});
        });
};

exports.products_patch = (req, res, next) => {
    const id = req.params.productId;
    const updateOps = {};
    for (const ops of req.body){
        updateOps[ops.propName] = ops.value;
    }
    Product.update({_id: id}, {$set: updateOps})
        .exec()
        .then(result => {
            console.log(result);
            res.status(200).json({
                message: 'Product Updated',
                request: {
                    type: 'GET',
                    url: 'http://localhost:8080/products/' + id
                }
            })
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                Message: err
            })
        })
};

exports.products_delete = (req, res, next) => {
    const id = req.params.productId;
    Product.deleteOne({_id: id})
        .exec()
        .then(result => {
            res.status(200).json({
                message: 'Product Deleted'
            })
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                Message: err
            })
        });
};