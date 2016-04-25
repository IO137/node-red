'use strict';

// Babel
console.log("status:Starting kobble instance...");
require('babel-core/register')({
  presets: [ 'es2015', 'stage-0' ],
  only: [/.*(node-red-contrib|kobble).*/]
});
require('babel-polyfill');

//Embed node-red
var http = require('http');
var express = require("express");
var RED = require("./red/red.js");
//console.log("args:" + JSON.stringify(process.argv));
var port = process.argv.length > 2 ? parseInt(process.argv[2]) : 1880;
var ff = process.argv.length > 3 ? process.argv[3] : "";
var kobbleDir = process.argv.length > 4 ? process.argv[4] : "";
var nodesDir = process.argv.length > 5 ? process.argv[5] : "";
console.log("port: " + port + " " + " kob:" + ff + " kobbleDir:" + kobbleDir);

var xapp = express();
xapp.use("/",express.static("public"));
var server = http.createServer(xapp);
var settings = {
  flowsFullPath: ff,
  uiPort: port,
  nodesDir: nodesDir,
  noBackup: true,
  kobbleDir: kobbleDir,
  httpAdminRoot:"/",
  httpNodeRoot: "/",
  userDir:kobbleDir,
  functionGlobalContext: { }
};
RED.init(server,settings);
xapp.use(settings.httpAdminRoot,RED.httpAdmin);
xapp.use(settings.httpNodeRoot,RED.httpNode);
server.listen(port);

console.log("status:Loading kobble runtime...");
RED.start().then(function() {
  console.log("status:kobble started"); //magic string
  if (process.send)
    process.send({msg:"kobble started"});
});
