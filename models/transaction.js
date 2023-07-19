const mongoose = require('mongoose')

var transactionSchema = mongoose.Schema({
    id: String,
    fullname: String,
    totalprice: String,
    address: String,
    phone: String,
    email: String,
    note: String,
    delivery: String,
    date: String,
    status: String,
    create_at: Date,
    update_at: Date,
    product: Array,
});

var Transaction = mongoose.model('transaction', transactionSchema);
module.exports = Transaction;