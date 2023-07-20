const mongoose = require('mongoose')

var productSchema = mongoose.Schema({
    id: String,
    price: String,
    model: String,
    brand: String,
    size: String,
    quantity: String,
    name: String,
    condition: String,
    status: String,
    saleprice: String,
    image: {
        photo1: String,
        photo2: String,
        photo3: String,
        photo4: String,
        photo5: String,
    },
    create_at: Date,
    update_at: Date
});

var Product = mongoose.model('product', productSchema);
module.exports = Product;