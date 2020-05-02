# Nodejs image using Nodejs version 10 is loaded to be the base of this image
FROM node:10

# Container port 8080 is exposed because that's where the server will be running
EXPOSE 8080

# We use the specified dir for our app files
WORKDIR /usr/src/app

# Server files are copied to the container
COPY server-b ./server-b
COPY config ./config
COPY rabbit-utils ./rabbit-utils
COPY utils ./utils
COPY package*.json ./

WORKDIR server-b

# wait-for-it.sh -script need to be changed to executable so it can be executed inside the container
# After this the script runs and makes sure that Nodejs server is not started until the 'rapid-runner-rabbit'
# container is up and running
RUN ["chmod", "+x", "../utils/wait-for-it.sh"]

# After the container is builded and up the Node server is started
CMD [ "npm", "start" ]
