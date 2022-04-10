import NetworkHandler from "./networkHandler.js"

const hideInterfaceDetailsHandler = (elem) => {
    let child = elem.lastChild
    let btn = document.createElement("button")
    btn.classList = "settings-items"
    btn.innerHTML = "Save"
    btn.id=elem.id
    btn.setAttribute("onclick",'saveInterfaceButtonHandler(event,this)')

    if(child.style.display == "none"){
        elem.querySelectorAll("."+child.classList).forEach(function(el) {
            el.style.display = 'flex';
         });

        if(elem.innerHTML.indexOf("Loopback")==-1 && elem.innerHTML.indexOf("Bluetooth")==-1 && elem.innerHTML.indexOf("Virtual")==-1){
            elem.appendChild(btn)
        }
    }else{
        elem.querySelectorAll("."+child.classList).forEach(function(el) {
            el.style.display = 'none';
         });
         
        elem.getElementsByTagName("button")[0].remove()
    }
}

const saveInterfaceButtonHandler = (elem) => {
    let inpTab = []
    let parent = elem.parentElement
    parent.querySelectorAll(".settings-items").forEach((el) =>{
        let inp = el.querySelector("input")
        if(inp != null){
            inpTab.push(inp.value)
        }
    })

    NetworkHandler(inpTab,elem.id)
}

export {hideInterfaceDetailsHandler, saveInterfaceButtonHandler}