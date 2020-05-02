'use strict';

const config = require('../config/config');

const Order = require('./service/OrderService.js');

const rabbitReceive = require('../rabbit-utils/receiveTask');

const fs = require('fs'),
    path = require('path'),
    http = require('http');

const app = require('connect')();
const swaggerTools = require('swagger-tools');
const jsyaml = require('js-yaml');

// swaggerRouter configuration
var options = {
  swaggerUi: path.join(__dirname, '/swagger.json'),
  controllers: path.join(__dirname, './controllers'),
  useStubs: process.env.NODE_ENV === 'development' // Conditionally turn on stubs (mock mode)
};

// The Swagger document (require it, build it programmatically, fetch it from a URL, ...)
var spec = fs.readFileSync(path.join(__dirname,'api/swagger.yaml'), 'utf8');
var swaggerDoc = jsyaml.safeLoad(spec);

const serverPort = config.globalConfig.portA;

// Initialize the Swagger middleware
swaggerTools.initializeMiddleware(swaggerDoc, function (middleware) {

  // Interpret Swagger resources and attach metadata to request - must be first in swagger-tools middleware chain
  app.use(middleware.swaggerMetadata());

  // Validate Swagger requests
  app.use(middleware.swaggerValidator());

  // Route validated requests to appropriate controller
  app.use(middleware.swaggerRouter(options));

  // Serve the Swagger documents and Swagger UI
  app.use(middleware.swaggerUi());

  // Start the server
  http.createServer(app).listen(serverPort, function () {
    rabbitReceive.getTask(config.globalConfig.rabbitHost, config.globalConfig.queueEnd, (data) => {
      console.log("READY SANDWICH ORDER RECEIVED FROM SERVER B!");
      if (data != null) {
        console.log("DATA: ", data);
        console.log("DATA TYPE: ", typeof data);
        console.log("DATA(INT): ", parseInt(data));
        data = parseInt(data);
        if (!Number.isSafeInteger(data)) {
          console.log("FAILED TO PARSE RECEIVED DATA TO INT");
          return;
        }
        Order.setOrderStatus(parseInt(data), "ready").then((resp) => {
          console.log("Order marked ready: ", resp);
        }).catch((err) => {
          console.log("Failed to set order status: ", err);
        })
      }
      else {
        console.log("DATA WAS NULL SERVER A!");
      }
    });
    console.log('Your server is listening on port %d (http://localhost:%d)', serverPort, serverPort);
    console.log('Swagger-ui is available on http://localhost:%d/docs', serverPort);
  });

});
