const express = require('express')
var router = express.Router();
const Transaction = require('../models/transaction.js')
const User = require('../models/user.js')
const Product = require('../models/product.js')
const LocalStorage = require('node-localstorage').LocalStorage;
const localStorage = new LocalStorage('./scratch');
const utils = require('../utils.js')
var fs = require('fs');

// Set a value
// localStorage.setItem('key', 'value');

// // Get a value
// const value = localStorage.getItem('key');
// console.log(value); // Output: "value"

router.get('/product', (req, res) => {
    let cart = req.session.cart
    Product.find({status: "available"},function(err, products){
        if (products != null){
            return res.render('./Product/allproduct', {title:'Sản phẩm', products: products, cart : cart})
        }
        else return res.render('./Home/404', {title:'Không tìm thấy trang'})
    })
    .skip(0)
    .limit(10)
    .lean()
})

//Sản phẩm
router.get('/product/:id', (req, res,) => {
    let cart = req.session.cart
    let success = req.session.success
    req.session.success = null
    Product.findOne({id: req.params.id}, function(err, product){
        Product.find({status: "available"},function(err, products){
            if (products != null){
                return res.render('./Product/detail', {title: product.name, product:product, cart : cart, products: products, success: success})
                // return res.render('./Product/allproduct', {title:'Sản phẩm', products: products, cart : cart})
            }
            else return res.render('./Home/404', {title:'Không tìm thấy trang'})
        }).lean()
    }).lean()
})

router.get('/cart', (req, res,) => {
    let cart = req.session.cart
    return res.render('./Product/cart', {title:'Giỏ hàng', cart : cart})
})

//thêm vào giỏ hàng
router.post('/cart/:id/', (req, res) => {
    const referer = req.headers.referer;

    Product.findOne({id: req.params.id}, function(err, product){
        if (product != null){
            const quantity = parseInt(req.body.quantity);
            const size = req.body.size

            const cart = req.session.cart || [];
                let item = {
                    id: product.id,
                    image: product.image.photo1,
                    name: product.name,
                    price: product.price,
                    size: size,
                    quantity: quantity,
                    totalprice: quantity * product.price
                };

            const preitem = cart.filter(item => (item.id == req.params.id) && (item.size == size));
            if (preitem.length != 0) {
                req.session.cart = cart.filter(item => item.id !== req.params.id);
                 item = {   
                    id: product.id,
                    image: product.image.photo1,
                    name: product.name,
                    size: size,
                    price: product.price,
                    quantity: preitem[0].quantity + quantity,
                    totalprice: (preitem[0].quantity + quantity) * product.price
                };
                req.session.cart.push(item);
            }
            else{
                console.log(item)
                req.session.cart = cart || [];
                req.session.cart.push(item);
            }

            const referer = req.headers.referer;
            req.session.success = "Thêm vào giỏ hàng thành công"
            return res.redirect(referer || '/');
        }
        else return res.redirect(referer || '/');;
    }).lean()
});


router.post('/cart/remove/:id/:size', (req, res) => {
    const referer = req.headers.referer;
    const cart = req.session.cart || [];
    req.session.cart = cart.filter(item => ((item.id !== req.params.id) || (item.size !== req.params.size)));
    req.session.success = "Xóa sản phẩm thành công"
    return res.redirect(referer || '/');
});

router.get('/order', (req, res) => {
    let cart = req.session.cart
    let products = req.session.products
   
    return res.render('./Product/order', {title:'Đặt hàng', products : products, cart : cart })
});

router.get('/order-success/:id', (req, res) =>  {
    req.session.cart = []
    Transaction.findOne({id: req.params.id}, function(err, order){  
        return res.render('./Product/ordersuccess', {title:'Đặt hàng thành công', order: order })
    }).lean()
});

router.post('/order-success', async (req, res) => {
    let totalprice = 0;
    req.session.cart.forEach(item => {
        totalprice += item.price * item.quantity
    });

    let id = utils.generate_id(6)

    const order = await new Transaction({
        id: id,
        fullname: req.body.name,
        totalprice: totalprice,
        address: req.body.address,
        phone: req.body.phone,
        email: req.body.email,
        note: req.body.note,
        delivery: req.body.delivery,
        date: new Date,
        status: "in processing",
        create_at: new Date,
        update_at: new Date,
        product: req.session.cart
    }).save()

    return res.redirect('/order-success/' + id)
});

// đặt hàng
router.post('/order', (req, res) => {
    let cart = req.session.cart
    return res.render('./Product/ordersuccess', {title:'Dặt hàng thành công', cart : cart})
})

module.exports = router;