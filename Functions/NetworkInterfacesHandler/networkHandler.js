const sudo = require('exec-root')

import notificationInterfaceChanged from "../Notifications/notifications.js"

let masksArr = ["0.0.0.0","128.0.0.0","192.0.0.0","224.0.0.0",
"240.0.0.0","248.0.0.0","252.0.0.0","254.0.0.0","255.0.0.0",
"255.128.0.0","255.192.0.0","255.224.0.0","255.240.0.0","255.248.0.0",
"255.252.0.0","255.254.0.0","255.255.0.0","255.255.128.0","255.255.192.0",
"255.255.224.0","255.255.240.0","255.255.248.0","255.255.252.0","255.255.254.0",
"255.255.255.0","255.255.255.128","255.255.255.192","255.255.255.224","255.255.255.240",
"255.255.255.248","255.255.255.252","255.255.255.254","255.255.255.255"]

const options = {
    name: 'Electron',
    icns: '/'
};

const NetworkHandler = (inpTab,name) => {


    if(inpTab[0]=="No"){
        let maskShort = inpTab[2].split("/")
        let mask = masksArr[maskShort[1]]
            async function Check(){
                await sudo.exec(`netsh interface ip set address name="${name}" static ${inpTab[1]} ${mask} ${inpTab[3]} && netsh interface ipv4 add dnsserver "${name}" 8.8.8.8 index=1`,options)
                let message = "Interface has been changed to static address"
                notificationInterfaceChanged(name,message)
            }
            Check()
        
    }else{
            async function Check(){
                await sudo.exec(`netsh interface ip set address name="${name}" dhcp`,options)
                let message = "Interface has been changed to DHCP"
                notificationInterfaceChanged(name,message)
            }
            Check()
    }
}

export default NetworkHandler