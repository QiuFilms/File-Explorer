const { remote, BrowserWindow} = require('electron');
const window = remote.getCurrentWindow();

function minimize(){
    remote.BrowserWindow.getFocusedWindow().minimize();
}

function maximize(){
    if (!window.isMaximized()) {
        window.maximize();          
    } else {
        window.unmaximize();
    }
}

function closeWindow(){
    window.close();
}

export {minimize, maximize, closeWindow}