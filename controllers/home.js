const express = require('express');
var router = express.Router();
const User = require('../models/user.js')
const utils = require('../utils.js')
const Product = require('../models/product.js')

// home - trang chủ
router.get('/', (req, res) => {
    let cart = req.session.cart
    Product.find({status: "available"},function(err, products){
        if (products != null){
            console.log("sản phẩm "+ products)
            return res.render('./Home/index', {title: 'Trang chủ', products: products, cart: cart}) 
        }
        else return res.render('./Home/404', {title:'Không tìm thấy trang'})
    })
    .skip(0)
    .limit(5)
    .lean() 
})

router.get('/product/sneaker', (req, res) => {
    let cart = req.session.cart
    return res.render('./Product/sneaker', {title: 'Giày thể thao', cart: cart})     
})

router.get('/product/sandal', (req, res) => {
    let cart = req.session.cart
    return res.render('./Product/sandal', {title: 'Dép thời trang', cart: cart})    
})

router.get('/about', (req, res) => {
    let cart = req.session.cart
    return res.render('./Home/about', {title: 'Về chúng tôi', cart: cart})    
})

router.get('/contact', (req, res) => {
    let cart = req.session.cart
    return res.render('./Home/contact', {title: 'Liên lạc', cart: cart})    
})



module.exports = router;