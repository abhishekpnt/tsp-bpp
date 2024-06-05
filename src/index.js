"use strict";
const express = require("express");
const envFile = process.env.NODE_ENV ? `.env.${process.env.NODE_ENV}` : '.env';
const dotenv = require('dotenv').config({ path: envFile });
const http = require('http')
const body_parser = require("body-parser");
const cookieParser = require("cookie-parser");
const service = require("./service");

const app = express(); // creates express http server
// app.use(cors());
app.use(body_parser.json());
app.use(cookieParser());

// Sets server port and logs message on success
let port = process.env.PORT || 3030;
app.listen(port, () => console.log("webhook is listening port: %s", port));

app.get("/health", (req, res) => {
  res.send(`App is running.. \n`);
});

app.post("/webhook", (req, res) => {
  // console.log("/webhook: incoming request \n%o ", JSON.stringify(req.body));
  service.webhook(req, res);

});
