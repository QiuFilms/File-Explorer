const child = require('child_process');

function settingsNetworkInterfaces(parent){
    let div = document.createElement("div")
    div.classList = "settings-title"
    parent.appendChild(div)
    child.exec('@chcp 65001 >nul && netsh interface ipv4 show addresses',{encoding: "UTF-8"}, (err, stdout) => {

        let std = stdout.split(/\r?\n/);
        for(let x in std){
            if(std[x-1]===""){
                let arr = std[x].split('"')
                if(arr[1]!=undefined){
                    var innerDiv = document.createElement("div")
                    innerDiv.id=arr[1] 
                    innerDiv.setAttribute("onclick","hideInterfaceDetails(this)")
                    div.appendChild(innerDiv)
                    innerDiv.classList = "settings-interface-title"
                    innerDiv.innerHTML += "<h3>Interface "+arr[1]+":</h3>"
                    div.id = arr[1]
                }

            }else{
                if(std[x]!==""){
                    let elem = document.createElement("div")
                    let div1 = document.createElement("div")
                    let input = document.createElement("input")
                    elem.appendChild(div1)
                    elem.appendChild(input)
                    elem.classList = "settings-items"
                    elem.setAttribute("onclick","stopProp(event)")
                    elem.style.display = "none"
                    let newArr = std[x].split(":")
                    newArr = newArr.filter(n=>n)
                    div1.innerHTML= newArr[0].trim()
                    input.value = newArr[1].trim()

                    if(std[x].includes("DHCP")){
                        input.minLength = 2
                        input.maxLength = 3
                        input.value = newArr[1].trim()
                    }else if(std[x].includes("IP")){
                        input.minLength = 7 
                        input.maxLength = 15
                        input.value = newArr[1].trim()
                        input.pattern ="^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$"
                    }else if(std[x].includes("Subnet")){
                        newArr = newArr[1].split("(")
                        input.readOnly = true
                        input.value = newArr[0].trim()
                    }

                    innerDiv.appendChild(elem)
                }
            }
        }
    });
}

export default settingsNetworkInterfaces