const $ = require('jquery');
const { remote } = require('electron');


remote.BrowserWindow.getFocusedWindow().minimize();
    