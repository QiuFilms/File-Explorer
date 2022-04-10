const { remote } = require('electron')

function notificationInterfaceChanged(name, message){
    new remote.Notification({ title: `${name} interface has been changed`, body: message}).show()
}

export default notificationInterfaceChanged