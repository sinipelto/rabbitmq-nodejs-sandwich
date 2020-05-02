'use strict';

const fs = require('fs');

function isDocker() {
    try {
        return fs.readFileSync('/proc/self/cgroup', 'utf8').includes('docker');
    } catch (_) {
        return false;
    }
}

// Configuration for running in localhost
const localConfig = {
    "portA": 80,
    "portB": 81,
    "rabbitHost": "localhost",
    "hostA": "0.0.0.0",
    "hostB": "0.0.0.0",
    "queueStart": "SandwichBegin",
    "queueEnd": "SandwichEnd",
};

// Configuration for running with Docker Compose
const dockerConfig = {
    "portA": 8080,
    "portB": 8080,
    "rabbitHost": "rapid-runner-rabbit",
    "hostA": "0.0.0.0",
    "hostB": "0.0.0.0",
    "queueStart": "SandwichBegin",
    "queueEnd": "SandwichEnd",
};

// Publish configuration
// Offer explicit configurations and
// a determined global configuration

module.exports.localConfig = localConfig;
module.exports.dockerConfig = dockerConfig;

isDocker() ? module.exports.globalConfig = dockerConfig : module.exports.globalConfig = localConfig;
