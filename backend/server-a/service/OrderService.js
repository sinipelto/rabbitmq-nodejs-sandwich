'use strict';

// Keep track of last created objects so no need to traverse database
// when creating new objects
var lastId = 0;

// Our fancy, magical and hyper complex in-memory database for storing orders ":D"
var database = {};


/**
 * Add an order for an sandwich
 *
 * order Order place an order for a sandwich
 * returns Order
 **/
exports.addOrder = function (order) {
    return new Promise(function (resolve, reject) {
        var sandId = parseInt(order.sandwichId);

        // Handle invalid sandwich id
        if (!Number.isSafeInteger(sandId) || sandId <= 0) {
            reject({code: 400, msg: "Invalid SandwichId provided."});
        }

        else {
            // Create new order object
            var ord = {
                "id": ++lastId,
                "sandwichId": sandId,
                "status": "ordered"
            };

            // Store the new order to the 'database'
            database[lastId] = ord;

            resolve(ord);
        }
    });
}


/**
 * Find an order by its ID
 * IDs must be positive integers
 *
 * orderId Long ID of the order that needs to be fetched
 * returns Order
 **/
exports.getOrderById = function (orderId) {
    return new Promise(function (resolve, reject) {
        var id = parseInt(orderId);

        // Handle invalid id
        if (!Number.isSafeInteger(id) || id <= 0) {
            reject({code: 400, msg: "Invalid OrderId provided."});
        }

        // OrderId not between 1...lastId
        // => doesnt exist!
        else if (id > lastId) {
            reject({code: 404, msg: "Order not found."});
        }

        // Retrieve order from database and resolve it
        else {
            resolve(database[id]);
        }
    });
}


/**
 * Get a list of all orders. Empty array if no orders are found.
 *
 * returns ArrayOfOrders
 **/
exports.getOrders = function () {
    return new Promise(function (resolve, reject) {
        resolve(Object.values(database));
    });
}

const statuses = ["ordered", "received", "inQueue", "ready", "failed"];

/**
 * Change order status. Use this for internal purposes only.
 * Changes the order status to one of the pre-set arguments.
 *
 **/
exports.setOrderStatus = function (orderId, status) {
    return new Promise(function (resolve, reject) {
        var id = parseInt(orderId);

        // Handle invalid id
        if (!Number.isSafeInteger(id) || id <= 0) {
            reject({code: 400, msg: "Invalid OrderId provided."});
        }

        else if (!statuses.includes(status)) {
            reject({code: 400, msg: "Invalid Order Status provided."});
        }

        // OrderId not between 1...lastId
        // => doesnt exist!
        else if (id > lastId) {
            reject({code: 404, msg: "Order not found."});
        }

        // Change order status and return order
        else {
            database[orderId].status = status;
            resolve(database[orderId]);
        }
    });
}
