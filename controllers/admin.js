const express = require('express')
var router = express.Router();
const Transaction = require('../models/transaction.js')
const User = require('../models/user.js')
const nodemailer =  require('nodemailer');
const formidable = require("formidable");
const utils = require('../utils.js')
const config = require('../config.js')
const fs = require('fs')
const Product = require('../models/product.js')

// Router admin
router.get('/admin', (req, res) => {
    return res.render('./Admin/admin', {layout:'main', title:'Quản trị'})
})
//xem danh sách user
router.get('/admin/users/:type', (req, res) => {
    if (!req.session.user)  return res.redirect('/login')
    else if(req.session.user.role != 'admin') return res.redirect('/')
    
    var type = req.params.type
    User.find({status: type, role: 'user'}, function(err, users){
        if(users != null){
            return res.render('./Admin/adminlistuser', {layout:'main', title:'admin', users: users, type: type})
        } 
        else {  
            return res.redirect('/')
        }
    }).lean();
})

//xem danh sách transactions
router.get('/admin/transactions', (req, res) => {
    Transaction.find(function(err, trans){
        if(trans != null){ 
            return res.render('./Admin/adminlisttrans', {layout:'main', title:'admin', trans: trans})
        } 
        else {  
            return res.redirect('/')
        }
    }).sort({create_at: -1}).lean();
})


router.get('/admin/addproduct', (req, res) => {
     let success = req.session.success
    req.session.success = null
    Product.find(function(err, products){
        if(products != null){ 
            return res.render('./Admin/addproduct', {layout:'main', title:'admin', products:products, success: success})
        } 
        else {  
            return res.redirect('/')
        }
    }).lean();

})


router.post('/admin/addproduct', (req, res) => {
    var form = new formidable.IncomingForm();
    form.parse(req, async function(err, fields, files){
            if(err) return res.redirect(303, '/404');

                    var id = utils.generate_id(5);
                    // Thiết lập nơi chứa file ảnh
                    var frontoldPath = files.photofront.filepath
                    var frontnewPath = config.PhotoDir + '/' + id + ".jpg" 

                    fs.copyFile(frontoldPath, frontnewPath, function (err) { //Di chuyển file ảnh 
                        if (err) throw err;
                    });
                            
                    new Product({
                        id: id,
                        price: fields.price,
                        model: fields.model,
                        brand: fields.brand,
                        size: fields.size,
                        quantity: fields.quantity,
                        name: fields.name + ' '+ '['+ id +']',
                        status: 'available',
                        image:{
                            photo1: id + ".jpg"
                        },
                        create_at: new Date,
                        update_at: new Date
                    }).save(); 
            })
            req.session.success = 'Thêm sản phẩm thành công'
            return res.redirect('/admin/addproduct')    
}) ; 

router.get('/admin/remove/:id', (req, res) => {
    Product.deleteOne({id: req.params.id}, function(err, product){
        if (product != null){
            return res.redirect('/admin/addproduct') 
            // return res.render('./Product/allproduct', {title:'Sản phẩm', products: products, cart : cart})
        }
        else return res.render('./Home/404', {title:'Không tìm thấy trang'})
    }).lean()

})

module.exports = router;