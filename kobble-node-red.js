'use strict';

var fs = require('fs');
var _ = require('lodash');
var path = require('path');
var es2015 = path.join(__dirname, "node_modules", "babel-preset-es2015");
var stage0 = path.join(__dirname, "node_modules", "babel-preset-stage-0");
//console.log("preset: " + es2015 + " " + stage0);

// Babel
console.log("status:Starting kobble instance...");
require('babel-core/register')({
  presets: [ es2015, stage0 ],
  only: [/.*(kobble).*/]
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
var userDir = process.argv.length > 5 ? process.argv[5] : kobbleDir;
var userSettingsFile = path.join(userDir, "settings.json");
var userSettings = {};
try {
    fs.accessSync(userSettingsFile, fs.F_OK);
    var userSettingsStr = fs.readFileSync(userSettingsFile, "utf8");
    userSettings = JSON.parse(userSettingsStr);
} catch (e) {
}

console.log("port: " + port + " " + " kob:" + ff + " kobbleDir:" + kobbleDir + " userDir: " + userDir);

var xapp = express();
xapp.use("/",express.static("public"));
var server = http.createServer(xapp);
var settings = {
  flowsFullPath: ff,
  uiPort: port,
  verbose: true,
  noBackup: true,
  kobbleDir: kobbleDir,
  httpAdminRoot:"/",
  httpNodeRoot: "/",
  userDir:userDir
};
_.merge(settings, userSettings);
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
