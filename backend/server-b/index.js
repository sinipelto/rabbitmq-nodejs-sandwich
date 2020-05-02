'use strict';

const config = require('../config/config');

const express = require('express');

const rabbitSend = require('../rabbit-utils/sendTask');
const rabbitReceive = require('../rabbit-utils/receiveTask');

// Constants
const HOST = config.globalConfig.hostB;
const PORT = config.globalConfig.portB;

// App
const app = express();

app.get('/', (req, res) => {
  res.send("HELLO WORLD!");
});

rabbitReceive.getTask(config.globalConfig.rabbitHost, config.globalConfig.queueStart, (data) => {
  console.log("RABBIT MSG RECEIVED SERVER B!");
  console.log("DATA: ", data);
  console.log("DATA TYPE: ", typeof data);
  if (data != null) {
    // Process the order and send it back to A.
    rabbitSend.addTask(config.globalConfig.rabbitHost, config.globalConfig.queueEnd, parseInt(data), (resp) => {
      if (resp) {
        console.log("RESPONSE SENT OK FROM B TO A!");
      }
      else {
        console.log("FAILED TO SEND READY SANDWICH FROM B!");
      }
    })
  }
  else {
    console.log("DATA WAS NULL");
  }
});

app.listen(PORT, HOST);
console.log(`Running inside container on http://${HOST}:${PORT}`);
