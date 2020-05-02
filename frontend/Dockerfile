# Nodejs image using Nodejs version 10 is loaded to be the base of this image
FROM node:latest

# Container port 8080 is exposed because that's where the server will be running
EXPOSE 3000

# We use the specified dir for our app files
WORKDIR /usr/src/app

# Server files are copied to the container
COPY ./ ./

# After the container is builded and up the Node server is started
CMD [ "npm", "start" ]
