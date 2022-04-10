import CreateTabElement from "./createTabElement.js";
import HideContextMenus from "../MiscFuntions/contextMenus.js";

class TabElement{
    constructor({path,tabId}){
        this.path = path;
        this.tabId = tabId;
    }


    firstTabFunction(){
        let path = this.path.split("/").filter(n => n)
        path.length == 1 ? CreateTabElement(path[0],this.tabId) : CreateTabElement(path[path.length-1],this.tabId)

        let tab = document.querySelector('#tabs').querySelector(".tab")
        tab.classList.add("tab-active")
        tab.classList.add("main")
        tab.querySelector(".tab_close").style.display = "none"
        tab.querySelector(".tab_close").style.cursor = "auto"
    }


    updateTabFunction(){
        let path = sessionStorage.getItem('currentPath').split("/").filter(n => n)

        document.querySelector(`#${this.tabId}`).querySelector('.tab_name').innerHTML = path[path.length-1] 
        document.querySelector(`#${this.tabId}`).setAttribute("Path", this.path)
        
        HideContextMenus()
    }

    addTabFunction(){

    }
}

//First tab and its specific options
const firstTab = () => {
    const AllElems = {
        path : sessionStorage.getItem('currentPath'),
        tabId : sessionStorage.getItem('CurrentTab'),
    }

    let TabElem = new TabElement(AllElems);
    TabElem.firstTabFunction()

}


//Update current tab name and path
const updateTab = () => {
    const AllElems = {
        path : sessionStorage.getItem('currentPath'),
        tabId : sessionStorage.getItem('CurrentTab'),
    }
    let TabElem = new TabElement(AllElems);
    TabElem.updateTabFunction()
}


const addTab = (pathStart) => {
    
    sessionStorage.setItem("currentPath",pathStart);
    //sessionStorage.setItem("previousPath","Start");
    sessionStorage.setItem("NumberOfTabs", sessionStorage.getItem("NumberOfTabs")+1);
    sessionStorage.setItem("Number", parseInt(sessionStorage.getItem("Number"))+1);

    if(sessionStorage.getItem("Number")>=10){
        document.querySelector("#addTab").style.display = "none"
    }

    let path = sessionStorage.getItem('currentPath').split("/").filter(n => n)

    if(path.length == 1){
        sessionStorage.setItem("CurrentTab",`Tab${sessionStorage.getItem("Number")}`);
        sessionStorage.setItem("BiggesyTabId",`Tab${sessionStorage.getItem("Number")}`);
        CreateTabElement(path[0],`Tab${sessionStorage.getItem("Number")}`)
    }else{
        sessionStorage.setItem("CurrentTab",`Tab${sessionStorage.getItem("Number")}`);
        sessionStorage.setItem("BiggesyTabId",`Tab${sessionStorage.getItem("Number")}`);
        CreateTabElement(path[path.length-1],`Tab${sessionStorage.getItem("Number")}`)
    
    }

}

export {firstTab,updateTab, addTab}