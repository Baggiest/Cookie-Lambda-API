const serverless = require("serverless-http");
const express = require("express");
const mongoose = require("mongoose");
const { v4: uuidv4 } = require('uuid');

const casinoID = "000000000000000000"

const Handler = require('./mongo/mongo-handler');
const handler = new Handler()
const Verifier = require('./src/security')
const verifier = new Verifier()
const Logger = require('./src/logger')
const logger = new Logger()


const MONGO_URL = process.env.MONGO_URL

const app = express();


async function dbConnect() {

  mongoose.connect(MONGO_URL, {

    "auth": { "authSource": "cookies" },
    "user": process.env.MONGO_USER,
    "pass": process.env.MONGO_PASS
  })

    .then(() => {
      console.log('Connected to remote DB')
    })
}

dbConnect().then(async () => {

  app.get("/", (req, res) => {

    return res.status(200).json({

      message: "whats up :)",

    });
  });

  app.post("/payuser/:id&:amount&:key", async (req, res) => {

    let userID = req.params.id
    let amount = Number(req.params.amount)
    let key = req.params.key

    let userExists = await handler.checkExist(userID)
    let keyExists = await verifier.verifySecretKey(key)

    if (!keyExists) return res.status(403).json({ result: false, message: "bad key" })
    if (!userExists) return res.status(404).json({ result: false, message: "user not found" })
    if (isNaN(amount)) return res.status(400).json({ result: false, message: "amount value should be a number" })

    let userData = await handler.fetchData(userID)

    try {

      handler.payUser(casinoID, userID, amount).then((result) => {
        const transactionID = uuidv4();

        logger.log("casino", amount, userID, transactionID, Math.floor(Date.now() / 100))
        if (result === true) return res.status(200).json({ result: true, from: "casino", to: userData.userTag, amount: amount, transactionID: transactionID });
      })
    }
    catch (e) {
      console.error(e)
    }

  });

  app.post("/chargeuser/:id&:amount&:key", async (req, res) => {

    let userID = req.params.id
    let amount = Number(req.params.amount)
    let key = req.params.key

    let userExists = await handler.checkExist(userID)
    let keyExists = await verifier.verifySecretKey(key)

    if (!keyExists) return res.status(403).json({ result: false, message: "bad key" })
    if (!userExists) return res.status(404).json({ result: false, message: "user not found" })
    if (isNaN(amount)) return res.status(400).json({ result: false, message: "amount value should be a number" })


    let userData = await handler.fetchData(userID)

    try {

      handler.payUser(userID, casinoID, amount).then((result) => {
        const transactionID = uuidv4();

        logger.log(userID, amount, "casino", transactionID, Math.floor(Date.now() / 100))
        if (result === true) return res.status(200).json({ result: true, from: "casino", to: userData.userTag, amount: amount, transactionID: transactionID });
      })
    }
    catch (e) {
      console.error(e)
    }

  });

  app.get("/balance/:id", async (req, res) => {

    if (!handler.checkExist(req.params.id)) return res.status(404).json({
      message: "user not found in database"
    })

    try {

      await handler.fetchData(req.params.id).then((resObject) => {

        console.log(resObject)
        try {
          return res.status(200).json({
            balance: resObject.balance,
            userTag: resObject.userTag,
            isBanned: resObject.isBanned
          });
        }

        catch (e) {
          console.error(e)
          return res.status(500).json({
            message: "sorry i fucked up :("
          })
        }
      })
    }
    catch (e) {
      console.error(e)
    }
  });


  app.use((req, res) => {

    return res.status(404).json({

      error: "Not Found",
    });
  });
})


module.exports.handler = serverless(app);
