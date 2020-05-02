'use strict';

const config = require('../../config/config');
const utils = require('../../utils/writer.js');
const rabbitSend = require('../../rabbit-utils/sendTask.js');

const Order = require('../service/OrderService.js');

const rabbitHost = config.globalConfig.rabbitHost;
const rabbitQueue = config.globalConfig.queueStart;


module.exports.addOrder = function addOrder (req, res, next) {
  var order = req.swagger.params['order'].value;
  Order.addOrder(order)
    .then(function (response) {
        rabbitSend.addTask(rabbitHost, rabbitQueue, parseInt(response.id), (resp) => {
            console.log("MQ MSG ACK!");
            if (resp) {
                console.log("MQ Send SUCCESS!");
                console.log("Order status " + response.status + " -> received");
                Order.setOrderStatus(response.id, "received").then((resp) => {
                    console.log(resp);
                }).catch((err) => {
                    console.log("Status change failed: ", err);
                });
            }
            else {
                console.log("MQ Send FAIL!");
                console.log("Order status " + response.status + " -> failed");
                Order.setOrderStatus(response.id, "failed").then((resp) => {
                    console.log(resp);
                }).catch((err) => {
                    console.log("Status change failed: ", err);
                });
            }
        });
        console.log("Order status " + response.status + " -> inQueue");
        Order.setOrderStatus(response.id, "inQueue").then((resp) => {
            console.log(resp);
        }).catch((err) => {
            console.log("Status change failed: ", err);
        });
        utils.writeJson(res, response);
    })
    .catch((response) => {
      utils.writeJson(res, utils.respondWithCode(response.code, response.msg));
    });
};

module.exports.getOrderById = function getOrderById (req, res, next) {
  var orderId = req.swagger.params['orderId'].value;
  Order.getOrderById(orderId)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, utils.respondWithCode(response.code, response.msg));
    });
};

module.exports.getOrders = function getOrders (req, res, next) {
  Order.getOrders()
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, utils.respondWithCode(response.code, response.msg));
    });
};
