'use strict';

// Start a node-red instance
var child = require('child_process');
const kob = child.fork(`${__dirname}/kobble-node-red.js`);
var started = new Promise(function(resolve, reject) {
  kob.on('message', (m) => {
    console.log('kobble got message:', JSON.stringify(m));
    resolve(true);
  });
});

const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;

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
