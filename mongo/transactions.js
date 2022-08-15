const mongoose = require('mongoose')

const transactionSchema = new mongoose.Schema({

    from: { type: String, require: true },
    amount: { type: Number, require: true },
    to: { type: String, require: true },
    transactionID: { type: String, require: true },
    timestamp: { type: Number, require: true },
    origin: { type: String, require: true }
})

module.exports = mongoose.model("Transactions", transactionSchema)