const $ = require('jquery');
const { remote } = require('electron');

alert(123)
remote.BrowserWindow.getFocusedWindow().minimize();
    