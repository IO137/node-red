'use strict';

// Babel
console.log("Starting kobble");
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

var started = new Promise(function(resolve, reject) {
  console.log("Starting node-red");
  RED.start().then(function() {
    resolve(true);
  });
});

const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;

// require starts node-red and returns a promise
//var started = require('./red.js');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
var mainWindow = null;

// Quit when all windows are closed.
app.on('window-all-closed', function() {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform != 'darwin') {
    app.quit();
  }
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.on('ready', function() {
  // Wait for node-red to start before starting browser window
  started.then(function() {
    console.log("kobble started, creating browser window");
    mainWindow = new BrowserWindow({width: 800, height: 600, "node-integration": true, icon:__dirname + '/editor/images/kobble.png'});
    // and load the index.html of the app.
    mainWindow.loadURL('http://127.0.0.1:1880');
    // Open the DevTools.
    // mainWindow.webContents.openDevTools();
    mainWindow.maximize();
    // Emitted when the window is closed.
    mainWindow.on('closed', function() {
      // Dereference the window object, usually you would store windows
      // in an array if your app supports multi windows, this is the time
      // when you should delete the corresponding element.
      mainWindow = null;
    });
  });
});
