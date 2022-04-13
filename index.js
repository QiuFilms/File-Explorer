const electron = require('electron')
const { app, BrowserWindow, Notification } = require('electron')
const url = require('url')
const path = require('path')
const { NONAME } = require('dns')


let mainWindow;

app.on('ready', function(){
    mainWindow = new BrowserWindow({
        width: 1400, 
        height: 800,
        backgroundColor:"#3a3f44;",
        frame:false,
        //opacity:0.2,
        transparent: false,
        hasShadow: false,
        icon:__dirname + './Icons/logo.png',
        resizable: true,
        vibrancy: 'ultra-dark',
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            enableRemoteModule: true,
            }
            
    });

    app.on('window-all-closed', () =>{
        if(process.platform !== 'darwin'){
          app.quit();
        }});

    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'index.html'),
        protocol: 'file',
        slashes: true
    }));
    
    mainWindow.webContents.openDevTools();
});



