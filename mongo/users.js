const mongoose = require ('mongoose')

const userSchema = new mongoose.Schema({

    userID: { type: String, required: true, unique: true },
    balance: { type: Number, required: true, default: 0 },
    serverID: { type: String, required: false },
    payedTaxes: { type: Boolean, default: false},
    userTag: { type: String , required:true},
    isBanned: { type: Boolean, default: false },
})

module.exports = mongoose.model("Users", userSchema)