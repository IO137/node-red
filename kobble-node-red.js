'use strict';

// Babel
console.log("Starting kobble-node-red");
require('babel-core/register')({
  presets: [ 'es2015', 'stage-0' ],
  only: [/.*node-red-contrib.*/]
});
require('babel-polyfill');

//Embed node-red
var http = require('http');
var express = require("express");
var RED = require("./red/red.js");

console.log("Embedding node-red");
var xapp = express();
xapp.use("/",express.static("public"));
var server = http.createServer(xapp);
var settings = {
    httpAdminRoot:"/",
    httpNodeRoot: "/",
    userDir:__dirname + "/contrib",
    functionGlobalContext: { }
};
RED.init(server,settings);
xapp.use(settings.httpAdminRoot,RED.httpAdmin);
xapp.use(settings.httpNodeRoot,RED.httpNode);
server.listen(1880);

console.log("Starting kobble node-red");
RED.start().then(function() {
  if (process.send)
    process.send({msg:"kobble node-red started"});
});
