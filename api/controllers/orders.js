const Order = require('../models/order');
const Product = require('../models/product');

const mongoose = require('mongoose');

exports.orders_get_all = (req, res, next) => {
    Order.find()
        .select(' productId quantity _id')
        .populate('productId', 'name price')
        .exec()
        .then(docs => {
            res.status(200).json({
                count: docs.length,
                orders: docs.map(doc => {
                    return {
                        _id: doc._id,
                        productId: doc.productId,
                        quantity: doc.quantity,
                        request: {
                            type: 'GET',
                            url: 'http://localhost:8080/orders/' + doc._id
                        }
                    }
                })
            })
        })
        .catch(err => {
            res.status(500).json({
                message: err
            })
        })
};

exports.orders_post = (req, res, next) => {
    Product.findById(req.body.productId)
        .then(product => {
            if(!product){
                return res.status(404).json({
                    message: 'product not found'
                })
            }
            const order = new Order({
                _id: mongoose.Types.ObjectId(),
                productId: req.body.productId,
                quantity: req.body.quantity
            });
            order
                .save()
                .then(result => {
                    console.log(result);
                    res.status(201).json({
                        message: 'Order was created',
                        order: result,
                        request: {
                            type: 'GET',
                            url: 'http://localhost:8080/orders/' + result._id
                        }
                    })
                })
                .catch((err) => {
                    console.log(err);
                    res.status(500).json({
                        message: err
                    })
                })
        })
        .catch(err => {
            res.status(500).json({
                Message: 'Product not found',
                error: err
            })
        })
};

exports.orders_get_singular = (req, res, next) => {
    const id = req.params.orderId;
    Order.findById(id)
        .populate('productId')
        .exec()
        .then(doc => {
            if(doc) {
                res.status(200).json({
                    _id: doc._id,
                    productId: doc.productId,
                    quantity: doc.quantity,
                    request: {
                        type: 'GET',
                        url: 'http://localhost:8080/products/' + doc.productId._id
                    }
                });
            }else{
                res.status(404).json({
                    message: 'order not found'
                })
            }
        })
        .catch(err => {
            res.status(500).json({
                Message: err
            });
        })
};

exports.orders_delete = (req, res, next) => {
    const id = req.params.orderId;
    Order.deleteOne({_id: id})
        .exec()
        .then(result => {
            res.status(200).json({
                message: 'Order Deleted'
            })
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                Message: err
            })
        });
};