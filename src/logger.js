const transactions = require('../mongo/transactions')

module.exports = class Logger {

    log(senderID, amount, receiverID, tID, time) {
        transactions.create({
            from: senderID,
            amount: amount,
            to: receiverID,
            transactionID: tID,
            timestamp: time,
            origin: "API"
        })
    }
}