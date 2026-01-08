const mongoose = require('mongoose')

const BagSchema = new mongoose.Schema({
    name: String,
    bagColor: String,
    user: String,
    createdAt: { type: Date, default: Date.now }
})

module.exports = mongoose.model('Bag', BagSchema)