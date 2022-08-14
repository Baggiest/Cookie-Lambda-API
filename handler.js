const serverless = require("serverless-http");
const express = require("express");
const Users = require('./mongo/users')
const mongoose = require("mongoose");

const { db } = require("./mongo/users");
const Handler = require('./mongo/mongo-handler');

const handler = new Handler("mongo handler")


// const MONGO_URL = process.env.MONGO

const app = express();


async function dbConnect() {

  mongoose.connect(MONGO_TEST_URL, {

    "auth": { "authSource": "cookies" },
    "user": MONGO_TEST_USER,
    "pass": MONGO_TEST_PASS
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

  app.get("/balance/:id", async (req, res) => {

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

  //other functions 


  app.use((req, res) => {

    return res.status(404).json({

      error: "Not Found",

    });
  });
})


module.exports.handler = serverless(app);
