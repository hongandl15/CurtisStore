const mongoose = require('mongoose')
const User = require('./models/user.js')
const Product = require('./models/product.js')
const utils = require('./utils.js')
require('dotenv').config()


mongoose.connect('mongodb+srv://cuvitdet15:RL3MaGszOGj5aaGf@cluster0.9iz1xzm.mongodb.net/sneaker', function (err) {
    if (err) throw err;
    console.log('Kết nối database thành công');
});

Product.find(function(err, products){
    if(products.length != 0) return;
    new Product({
        id: utils.generate_id(5),
        price: "300000",
        model: "airforce1",
        brand: "nike",
        size: "36",
        name: "Air Force 1 low",
        status: "available",
        quantity: "10",
        saleprice: "300000",
        image: {
            photo1: "product01.jpg",
            photo2: "String",
        },
        create_at: new Date,
        update_at: new Date,
    }).save()
    new Product({
        id: utils.generate_id(5),
        price: "200000",
        model: "airforce1",
        brand: "nike",
        size: "36",
        name: "Air Force 1 low",
        quantity: "10",
        status: "available",
        saleprice: "300000",
        image: {
            photo1: "product02.jpg",
            photo2: "String",
        },
        create_at: new Date,
        update_at: new Date,
    }).save()
    new Product({
        id: utils.generate_id(5),
        price: "500000",
        model: "airforce1",
        brand: "nike",
        size: "36",
        name: "Air Force 1 low",
        quantity: "10",
        status: "available",
        saleprice: "300000",
        image: {
            photo1: "product03.jpg",
            photo2: "String",
        },
        create_at: new Date,
        update_at: new Date,
    }).save()
    new Product({
        id: utils.generate_id(5),
        price: "400000",
        model: "airforce1",
        brand: "nike",
        size: "36",
        name: "Air Force 1 low",
        quantity: "10",
        status: "available",
        saleprice: "300000",
        image: {
            photo1: "product04.jpg",
            photo2: "String",
        },
        create_at: new Date,
        update_at: new Date,
    }).save()

})
