'use strict';

console.log("starting SmallBall Automator");
require('babel-core/register')({
  presets: [ 'es2015', 'stage-0' ],
  only: [/.*node-red-contrib.*/]
});
require('babel-polyfill');
const electron = require('electron');
const app = electron.app;  // Module to control application life.
const BrowserWindow = electron.BrowserWindow;  // Module to create native browser window.

// require starts node-red and returns a promise
console.log("starting node-red");
var started = require('./red.js');

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
    console.log("node-red started, creating browser window");
    mainWindow = new BrowserWindow({width: 800, height: 600, "node-integration": false});
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
