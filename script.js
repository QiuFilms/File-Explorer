const fs = require("fs");
const path = require('path');
const doc = document;
var spawn = require("child_process").spawn
const child = require('child_process');
const config = require("./Config/config.json")
const sudo = require('exec-root')
const fastFolderSize = require('fast-folder-size')


//Imports
import listDrives from "./Functions/DrivesHandler/listDrives.js"
import createDiskElement from "./Functions/createDiskElement.js"
import ListStartDrives from "./Functions/DrivesHandler/listStartDrives.js";
import CreateTabElement from "./Functions/TabsHandler/createTabElement.js";
import {firstTab, updateTab, addTab} from "./Functions/TabsHandler/manageTabs.js";
import NetworkHandler from "./Functions/NetworkInterfacesHandler/networkHandler.js";
import {hideInterfaceDetailsHandler, saveInterfaceButtonHandler} from "./Functions/NetworkInterfacesHandler/networkInterfaceHandler.js";
import {Folder, FileCreate} from "./Functions/FolderAndFilesHandler/FolderAndFilesHandler.js"
import {minimize, maximize, closeWindow} from "./Functions/WindowHandler/windowHandler.js"
import settingsNetworkInterfaces from "./Functions/SettingsTabHandler/settingsNetworkInterfaces.js";

window.minimize = minimize
window.maximize = maximize
window.closeWindow = closeWindow


//ListDrives
let x;
function drives(){
    listDrives()

    listDrives().then((data) => getDrives(data))

    function getDrives(data) {
        for( x in data){
            createDiskElement(data,x)
        }
    }
}

//CurrentPath
sessionStorage.setItem("currentPath","Start");
sessionStorage.setItem("previousPath","Start");
sessionStorage.setItem("CurrentTab","Tab");
sessionStorage.setItem("NumberOfTabs",1);
sessionStorage.setItem("Number",1);
sessionStorage.setItem("BiggestTabId","Tab");


window.start = function(isFocused) {
    if(sessionStorage.getItem("currentPath")=="Start" || sessionStorage.getItem("currentPath")=="start"){
        let content = doc.querySelector("#content")
        content.style.flexDirection = "row";
        function startDrives(data){
            child.exec('fsutil volume diskfree c:/',{encoding: "UTF-8"}, (err, stdout, stderr) => {
                if (err) {
                return;
                }
                let std = stdout.split(" ");
                var free = std[12].split("(")[1];
                var total = std[29].split("(")[1];
            });
            doc.querySelector("#path-text").innerHTML = `<img src='Icons/logo.png' alt=''> <img src='Arrows/ArrowF.png' alt='' id='pointer'> Start`;
            let iter = data.length - 1;
            content.innerHTML = "<h2>Devices and drives<div></div></h2>"
            content.setAttribute("ondrop","drop()")
            for(let x=0;x<=iter;x++){
                ListStartDrives(data,x)
            }
        } 

        listDrives().then((data) => startDrives(data))

    }else{

    if(sessionStorage.getItem("currentPath").length == 2){
        sessionStorage.setItem("currentPath",sessionStorage.getItem("currentPath")+"/")
    }
    let dir = sessionStorage.getItem("currentPath");
    if(isFocused==1){
        doc.querySelector("#path-text").innerHTML = `${dir}`;
        document.getElementById("path-text").focus();
    }else{
        doc.querySelector("#path-text").innerHTML = `<img src='Icons/logo.png' alt=''> <img src='Arrows/ArrowF.png' alt='' id='pointer'> ${dir}`;
    }
    let files1 = fs.readdirSync(dir)

    if(files1 == Error){
        alert(10)
    }


    openedFolder()
    
    if(dir.length > 3){
        dir += "/" 
    }


    for(x in files1){
        let isDirExists = fs.existsSync(dir+files1[x]) && fs.lstatSync(dir+files1[x]).isDirectory();
        if(isDirExists){
            let info = fs.lstatSync(dir+files1[x])
            Folder(files1[x],"normal",info, undefined)
        }   
    }

    for(x in files1){
        let isFileExists = fs.existsSync(dir+files1[x]) && fs.lstatSync(dir+files1[x]).isFile();
        if(isFileExists){
            let info = fs.lstatSync(dir+files1[x])
            let ext = path.extname(files1[x])

            FileCreate(files1[x],info,ext)
        }
    }




window.dragStartFun = (ev) => {
    if(ev.target.getAttribute("long")==null){
        sessionStorage.setItem("dragedElem",sessionStorage.getItem("currentPath")+"/"+ev.target.parentElement.getAttribute("long"))
    }else{
        sessionStorage.setItem("dragedElem",sessionStorage.getItem("currentPath")+"/"+ev.target.getAttribute("long"))
    }

}

window.drop = () =>{
    const [pathG,pathG2] = destructPath()


    console.log(pathG)
    console.log(pathG2)
    child.exec(`move ${pathG2} ${pathG}`,{encoding: "UTF-8"}, (err, stdout, stderr) => {
        if (err) {
        return;
        }else{
            content.innerHTML=""
            start()
        }

    });
}

window.onDropFolder = (e,elem) =>{
    e.stopPropagation();
    console.log(133)
    const [pathG,pathG2] = destructPath()
    let foldName = "\\"+elem.getAttribute("long");

    child.exec(`move ${pathG2} ${pathG+foldName}`,{encoding: "UTF-8"}, (err, stdout, stderr) => {
        if (err) {
        return;
        }else{
            content.innerHTML=""
            start()
        }

    });

}

window.allowDrop = (ev) => {
    ev.preventDefault();

}

function destructPath(){
    let dest = sessionStorage.getItem("currentPath").split("/");
    let src = sessionStorage.getItem("dragedElem").split("/");

    var temp1 = [];
    var pathG;

    for(let i of dest)
        i && temp1.push(i);
    
    for(let i in temp1){
        if(i==0){
            if(temp1.length == 1){
                pathG = temp1[i]+"\\";
            }else{
                pathG = temp1[i];
            }
        }else{
            pathG += "\\"+temp1[i];
        }
    }

    var temp1 = [];
    var pathG2;

    for(let i of src)
        i && temp1.push(i);
    
    for(let i in temp1){
        if(i==0){
            if(temp1.length == 1){
                pathG2 = temp1[i]+"\\";
            }else{
                pathG2 = temp1[i];
            }
        }else{
            pathG2 += "\\"+temp1[i];
        }
    }

    return [pathG,pathG2]
}

}

window.openFile = (fdir) => {
    child.exec(fdir)
}

window.cont = (e,elem) => {
    e.stopPropagation();
    updateDisplayFolder(e,elem)
}

window.cont2 = (e,elem) => {
    e.stopPropagation();
    updateDisplayFile(e,elem)
}

window.openFolderFromMenu = (e,elem) => {
    e.stopPropagation();
    sessionStorage.setItem('folderPath',(elem.parentElement.parentElement.attributes['name'].value));
    document.getElementById("contextMenuFolder").style.display = 'none';
    document.getElementById("content-outer").appendChild(document.getElementById("contextMenuFolder"))
    document.getElementById("contextMenuFile").style.display = 'none';
    document.getElementById("content-outer").appendChild(document.getElementById("contextMenuFile"))
    dirChange()
}

window.deleteFolderFromMenu = (e,elem) => {
    let dir = sessionStorage.getItem("currentPath");
    if(dir > 3){
        dir += "/"
    }
    let isDirExists = fs.existsSync(dir+elem.parentElement.parentElement.attributes["long"].value) && fs.lstatSync(dir+elem.parentElement.parentElement.attributes["long"].value).isDirectory();
    let isFileExists = fs.existsSync(dir+elem.parentElement.parentElement.attributes["long"].value) && fs.lstatSync(dir+elem.parentElement.parentElement.attributes["long"].value).isFile();
    if(isFileExists){
        fs.unlinkSync(dir+elem.parentElement.parentElement.attributes["long"].value);
    }else if(isDirExists){
        fs.rmdirSync(dir+elem.parentElement.parentElement.attributes["long"].value, {recursive: true, force: true})
    }
    e.stopPropagation();
    document.getElementById("contextMenuFolder").style.display = 'none';
    document.getElementById("content-outer").appendChild(document.getElementById("contextMenuFolder"))
    document.getElementById("contextMenuFile").style.display = 'none';
    document.getElementById("content-outer").appendChild(document.getElementById("contextMenuFile"))
    content.innerHTML = "";
    start()
}

window.saveRenameItem = (e,elem) => {
    e.stopPropagation();
    let dir = sessionStorage.getItem("currentPath");    
    if(dir.length > 3){
        dir += "/"
    }

    let name = dir+elem.parentElement.parentElement.attributes["long"].value;
    sessionStorage.setItem("renameName",name)
    document.getElementById("contextMenuFolder").style.display = 'none';
    document.getElementById("content-outer").appendChild(document.getElementById("contextMenuFolder"))

    document.getElementById("contextMenuFile").style.display = 'none';
    document.getElementById("content-outer").appendChild(document.getElementById("contextMenuFile"))
    document.querySelector("#rename").style.display = "";
}
window.renameItem = () => {
    let oldName = sessionStorage.getItem("renameName")
    let dir = sessionStorage.getItem("currentPath");   
    if(dir.length > 3){
        dir += "/"
    }
    let input = document.querySelector("#rename-input")
    fs.renameSync(oldName,dir+input.value)
    content.innerHTML = "";
    start();
}

window.openWith = (e,elem) => {
    e.stopPropagation()
    let len = config.OpenWith.Paths.length
    let olList= document.querySelector(".ol-List")
    for(let i=0;i<len;i++){
        let name = config.OpenWith.Paths[i].Name
        let li = doc.createElement("li");
        li.setAttribute("class","ol-Elem");
        li.setAttribute("onclick","alert(123)");
        li.innerHTML = name
        olList.appendChild(li)
    }
    
    if(olList.style.display == "none"){
        olList.style.display = ""
    }else{
        olList.style.display = "none"
        olList.innerHTML=""
    }


    //config.OpenWith.Paths.push({"Name": "Notepad", "path": "notepad"})
    console.log("Path 1:", config.OpenWith.Paths)
    let path = sessionStorage.getItem("currentPath")+elem.parentElement.parentElement.attributes["long"].value
}


window.updateDisplayFolder = (e,elem) => {
    e.stopPropagation();
    let contextMenuFolder = document.getElementById("contextMenuFolder")
    elem.appendChild(contextMenuFolder)
    document.getElementById('contextMenu').style.display = 'none';
    document.getElementById("contextMenuFolder").style.display = 'none';
    document.getElementById("contextMenuFile").style.display = 'none';
    contextMenuFolder.style.display = "";
    contextMenuFolder.style.left=elem.offsetLeft+50+"px";
    contextMenuFolder.style.top=elem.offsetTop+50+"px";
}


window.updateDisplayFile = (e,elem) => {
    e.stopPropagation();
    let contextMenuFile = document.getElementById("contextMenuFile")
    elem.appendChild(contextMenuFile)
    document.getElementById('contextMenu').style.display = 'none';
    document.getElementById("contextMenuFile").style.display = 'none';
    document.getElementById("contextMenuFolder").style.display = 'none';
    contextMenuFile.style.display = "";
    contextMenuFile.style.left=elem.offsetLeft+50+"px";
    contextMenuFile.style.top=elem.offsetTop+50+"px";
}





}


firstTab()

window.updateTab = () => {
    updateTab()
}

window.addTab = (pathStart = "Start") => {
    addTab(pathStart)
    start()
}

window.openInNewTab = (elem) =>{
    if(sessionStorage.getItem("currentPath").length == 3){
        var path = sessionStorage.getItem("currentPath")+elem.parentElement.parentElement.getAttribute("long")
    }else{
        var path = sessionStorage.getItem("currentPath")+"/"+elem.parentElement.parentElement.getAttribute("long")
    }
    

    console.log(path)
    document.getElementById("content-outer").appendChild(document.getElementById("contextMenuFolder"))
    content.innerHTML = ""
    addTab(path)
}

window.removeTab = (TabId) => {
    sessionStorage.setItem("NumberOfTabs", sessionStorage.getItem("NumberOfTabs")-1);
    sessionStorage.setItem("Number", parseInt(sessionStorage.getItem("Number"))-1);
    let tabList = doc.querySelector("#tabs")
    let removedItem = doc.getElementById(TabId.parentNode.id)
    console.log(removedItem)

    if(sessionStorage.getItem("Number")<10){
        doc.querySelector("#addTab").style.display = "block"
    }

    if(tabList.length < 2){
    }else{
        console.log(tabList)
        let newTabPath = tabList.children[0].attributes['path'].value
        let newTabId = tabList.children[0].id
        console.log(tabList.children[0])
        tabList.children[0].classList.add("tab-active")
        sessionStorage.setItem("currentPath",newTabPath);
        sessionStorage.setItem("CurrentTab",newTabId);
        removedItem.remove()

        content.innerHTML = ""
        start()
    }

}

window.cloudTab = () => {
    content.innerHTML = ""

    const checkFetch = async () => {
        try{   
            const checkKeyResponse = await fetch(`http://localhost:5000/name-check/qiufilms`)
            const jsonData = await checkKeyResponse.json();
            console.log(jsonData)
            for(let i in jsonData.Folder){
                Folder(jsonData.Folder[i],"cloud",0)
            }

            for(let i in jsonData.File){
                FileCreate(jsonData.File[i])
            }
        }catch (error) {
            console.log(error.message)
        }
    }
    checkFetch()

    sessionStorage.setItem("currentPath","Cloud")
    updateTab()
}

window.settingsTab = () => {
    content.innerHTML = ""
    let divTheme = document.createElement("div")
    divTheme.classList = "settingsThemeTab"
    divTheme.innerHTML=`
    <label for="cars"><h3>Theme:</h3></label>
    <select id="theme" onchange="changeTheme(this)">
        <option value="Light">Light</option>
        <option value="Dark">Dark</option>
    </select>`   
    content.appendChild(divTheme)

    let divEnable = document.createElement("div")
    divEnable.classList = "settingsThemeTab"
    divEnable.innerHTML = `<label for="cars"><h3>Cloud</h3></label>
    <select id="theme" onchange="enableCloud(this)">
        <option value="Yes">Yes</option>
        <option value="No">No</option>
    </select>`
    content.appendChild(divEnable)


    let divNetwork = document.createElement("div")
    divNetwork.classList = "settingsNetworkTab"
    content.appendChild(divNetwork)


    settingsNetworkInterfaces(divNetwork)
    
    sessionStorage.setItem("currentPath","Settings")
    sortDown()
    updateTab()
}


window.changeTheme = (selectObject) => {
    var value = selectObject.value;  
    if(value == "Light"){
        lightTheme()
    }else{
        darkTheme()
    }
}

window.enableCloud = (selectObject) => {
    var value = selectObject.value;  
    if(value == "Yes"){
        document.querySelector(".cloud").style.display = "flex"
    }else{
        document.querySelector(".cloud").style.display = "none"
    }
}

window.hideInterfaceDetails = (elem) => {
    hideInterfaceDetailsHandler(elem)
}

window.saveInterfaceButtonHandler = (e,elem) => {
    e.stopPropagation()
    saveInterfaceButtonHandler(elem)
}

window.stopProp = (e) =>{
    e.stopPropagation()
}

window.changeTab = (TabId,Path) => {
    hide()
    if(doc.querySelector(`#${TabId}`)){
        sessionStorage.setItem("currentPath",Path);
        sessionStorage.setItem("CurrentTab",TabId);
    
        let content = doc.getElementById("content");
        content.innerHTML = ""
    
        let TabClasses = doc.querySelectorAll(".tab").forEach(el => {
            el.classList.remove("tab-active")
        });
        
        doc.getElementById(TabId).classList.add("tab-active")
    }else{
        let tabList = doc.querySelector("#tabs")
        let newTabPath = tabList.children[0].attributes['path'].value
        let newTabId = tabList.children[0].id
        tabList.children[0].classList.add("tab-active")
        sessionStorage.setItem("currentPath",newTabPath);
        sessionStorage.setItem("CurrentTab",newTabId);
        let content = doc.getElementById("content");
        content.innerHTML = ""
    
        doc.querySelectorAll(".tab").forEach(el => {
            el.classList.remove("tab-active")
        });

        tabList.children[0].classList.add("tab-active")

    }    
    if(sessionStorage.getItem("currentPath")=="Settings"){
        settingsTab()
    }else if(sessionStorage.getItem("currentPath")=="Cloud"){
        cloudTab()
    }else{
        start() 
    }

}


window.dirChange =  () => {
    var currentPath = sessionStorage.getItem('currentPath').split("/")
    var temp1 = [];
    var pathG;

    for(let i of currentPath)
        i && temp1.push(i);
    
    for(let i in temp1){
        if(i==0){
            pathG = temp1[i];
        }else{
            pathG += "/"+temp1[i];
        }
    }

    sessionStorage.setItem("previousPath",pathG);
    sessionStorage.setItem('currentPath',(pathG+sessionStorage.getItem("folderPath")))

    content.innerHTML = "";
    updateTab()
    start(0)
}
start(0)

function logButtons(e) {
    if(e.buttons==8){
        backClick()
    }
}

window.backClick =  () => {
        var fields = sessionStorage.getItem("currentPath").split('/');

        var last = fields[fields.length-1]

        var prev = sessionStorage.getItem("currentPath").replace("/"+last, '')

        sessionStorage.setItem("currentPath",prev);
        content.innerHTML = "";
        updateTab()
        start()
    
}


document.addEventListener('mousedown', logButtons);


window.updateDisplay =  (event) => {
    let contextMenu =  document.querySelector("#contextMenu")
    contextMenu.style.display = "";
    contextMenu.style.left=event.offsetX+"px";
    contextMenu.style.top=event.offsetY+"px";
    document.getElementById("contextMenuFolder").style.display = 'none';
    document.getElementById("content-outer").appendChild(document.getElementById("contextMenuFolder"))
    document.getElementById("contextMenuFile").style.display = 'none';
    document.getElementById("content-outer").appendChild(document.getElementById("contextMenuFile"))
}

window.hide = () => {
    document.getElementById('contextMenu').style.display = 'none';
    document.getElementById("contextMenuFolder").style.display = 'none';
    document.getElementById("content-outer").appendChild(document.getElementById("contextMenuFolder"))
    document.getElementById("contextMenuFile").style.display = 'none';
    document.getElementById("content-outer").appendChild(document.getElementById("contextMenuFile"))
}

window.openCmd =  () => {

        if(__dirname.slice(0,2)==sessionStorage.getItem("currentPath").slice(0,2)){
            child.exec(`cd ${sessionStorage.getItem("currentPath").slice(0,2)}/ & cd ${sessionStorage.getItem("currentPath")} & start cmd.exe`);
        }else{
            child.exec(`${sessionStorage.getItem("currentPath").slice(0,2)} & cd ${sessionStorage.getItem("currentPath")} & start cmd.exe`);
        }
}

window.createFile = () => {
    document.getElementById("create").style.display = "";
    let input = document.getElementById("create-input");
    let inpPath = sessionStorage.getItem("currentPath")+"/"+input.value;
    fs.writeFile(inpPath, '', function (err) {
        if (err) throw err;
      });

    document.getElementById("create").style.display = "none";
    content.innerHTML = "";
    input.value = "";
    start()
}


let content = doc.getElementById("content");
window.showCreator = function () {
    document.getElementById("create").style.display = "";
}
window.showCreator2 = function () {
    document.getElementById("create2").style.display = "";
}

window.showDelete =  function () {
    document.getElementById("delete").style.display = "";
}


window.createFolder = () => {
    document.getElementById("create2").style.display = "";
    let input = document.getElementById("create-input2");
    let inpPath = sessionStorage.getItem("currentPath")+"/"+input.value;
    fs.mkdir(inpPath, "0744", function(err) {
        if (err) throw err;
    });
    document.getElementById("create2").style.display = "none";
    content.innerHTML = "";
    input.value = "";
    start()
}

window.deleteFile = () => {
    document.getElementById("delete").style.display = "";
    let input = document.getElementById("delete-input");
    let inpPath = sessionStorage.getItem("currentPath")+"/"+input.value;
    if(input.value.includes(".")){
        fs.unlinkSync(inpPath);
    }else{
        fs.rmdirSync(inpPath)
    }

    


    content.innerHTML = "";
    input.value = "";
    document.getElementById("delete").style.display = "none";
    start()
}


window.sortDown = () => {
    let currentPath = sessionStorage.getItem("currentPath")
    if(currentPath!="Start"){
        document.getElementById("content").style.flexDirection = "column";
        sessionStorage.setItem("view","down")
        let fold = document.getElementsByClassName("folder_div")
        let num = fold.length;
        for(let x = 0;x<num;x++){
            fold[x].style.flexDirection = "row";
            fold[x].style.maxWidth = "100%";
            fold[x].children[1].innerHTML = `${fold[x].getAttribute('long')}`
        }

        let info = document.querySelectorAll(".info")
        info.forEach(el => {
            el.style.display = "block"
        });

        let infoRest = document.querySelectorAll(".infoRest")
        infoRest.forEach(el => {
            el.style.display = "block"
        });
    }
}

window.sortRight = () => {
    let currentPath = sessionStorage.getItem("currentPath")
    if(currentPath!="Settings"){
        document.getElementById("content").style.flexDirection = "row";
        sessionStorage.setItem("view","right")
        let fold = document.getElementsByClassName("folder_div")
        let num = fold.length;
        for(let x = 0;x<num;x++){
            fold[x].style.flexDirection = "column";
            fold[x].style.maxWidth = "80px";
            fold[x].children[1].innerHTML = `${fold[x].getAttribute('short')}`
        }

        let info = document.querySelectorAll(".info")
        info.forEach(el => {
            el.style.display = "none"
        });

        let infoRest = document.querySelectorAll(".infoRest")
        infoRest.forEach(el => {
            el.style.display = "none"
        });
    }
}

window.checkView = () => {
    if(sessionStorage.getItem("view")=="down"){
        sortDown()
    }else if(sessionStorage.getItem("view")=="right"){
        sortRight()
    }
}


function checkTimeOut() {
    setInterval(function(){ checkView() }, 100);
}

checkTimeOut()


var input = document.getElementById("path-text");
input.addEventListener("keyup", function() {
  if (event.keyCode === 13) {
   event.preventDefault();
   let search = document.getElementById("path-text").innerHTML.split('<');
   sessionStorage.setItem("currentPath",search[0])
   document.getElementById("path-text").innerHTML = search[0];
   document.getElementById("content").innerHTML = "";
   document.getElementById("path-text").focus()
   updateTab()
   start(1)
   input.setAttribute("contenteditable","true")
  }
});


window.foc = function (){
    document.getElementById("path-text").innerHTML = sessionStorage.getItem("currentPath")
}

input.addEventListener('focusin', () => {
    document.getElementById("path-text").innerHTML = sessionStorage.getItem("currentPath")
});
  
input.addEventListener('focusout', () => {
    document.getElementById("path-text").innerHTML =`<img src='Icons/logo.png' alt=''> <img src='Arrows/ArrowF.png' alt='' id='pointer'> ${sessionStorage.getItem("currentPath")}`;
});


function openedFolder(){
    document.getElementById("openFolder").innerHTML = '';
    let ul = document.createElement("ul")
    ul.setAttribute("path",sessionStorage.getItem("currentPath"))
    ul.setAttribute("class","FolderList");
    document.getElementById("openFolder").appendChild(ul)
    var folderCurrent = sessionStorage.getItem("currentPath").split("/")

    let i = 0
    
    for(x in folderCurrent){
        if(x==0){
            let li = document.createElement("li")
            li.setAttribute("id",`li${i}`)
            li.setAttribute("name",folderCurrent[x])
            li.innerHTML = `<div name='${folderCurrent[x]}' class='leftEl' onclick="leftFolderClick(this.getAttribute('name'));updateTab()"><img src='Icons/logo.png'><p>${folderCurrent[x]}</p></img></div>`;
            ul.appendChild(li)
            i++
        }else if (x==1 && folderCurrent[x]==""){
        }else{
            let ul2 = document.createElement("ul")
            let li = document.createElement("li")
            li.setAttribute("id",`li${i}`)
            li.setAttribute("name",folderCurrent[x])
            li.innerHTML = `<div name='${folderCurrent[x]}' class='leftEl' onclick="leftFolderClick(this.getAttribute('name'));updateTab()"><img src='Icons/logo.png'><p name='${folderCurrent[x]}' onclick="leftFolderClick(this.getAttribute('name'))")>${folderCurrent[x]}</p></img></div>`;
            ul2.appendChild(li);
            document.getElementById(`li${i-1}`).appendChild(ul2)
            i++
        }
    }

}

window.leftFolderClick =  function (name){
    var folderCurrent = sessionStorage.getItem("currentPath").split("/")
    let contain = folderCurrent.indexOf(name)
    var path = "";

    for(let i=0; i<= contain;i++){
        if(i==0){
            path = path +folderCurrent[i]+"/"
        }else{
            path = path +"/"+folderCurrent[i]
        }
    
    }

    let checkVar1 = path.split("/")
    var temp1 = [];
    var pathG;

    for(let i of checkVar1)
        i && temp1.push(i);
    
    for(let i in temp1){
        if(i==0){
            pathG = temp1[i];
        }else{
            pathG += "/"+temp1[i];
        }
    }
    

    var temp2 = [];
    var pathL;
    for(let i of folderCurrent)
        i && temp2.push(i);
        
    for(let i in temp1){
        if(i==0){
            pathL = temp1[i];
        }else{
            pathL += "/"+temp1[i];
        }
    }

    if(temp2[temp2.length-1]===temp1[temp1.length-1]){
    }else{
        sessionStorage.setItem("previousPath",pathL);
        sessionStorage.setItem("currentPath",pathG)
        document.getElementById("content").innerHTML="";

        start()
    }
}

window.listActions = function (elClass){
    if(elClass == "hidden" || elClass == ""){
        document.querySelector("#actions").className="showList";
        document.querySelector(`.${elClass}`).className = "visible";
        document.querySelector("#arrow").className = "rotateUp";
    }else{
        document.querySelector("#actions").className="hideList";
        document.querySelector(`.${elClass}`).className = "hidden";
        document.querySelector("#arrow").className = "rotateDown";
    }

}


let elem = document.querySelector("#disks")
setInterval(function () {
    if(elem.innerHTML == ""){
         drives()
    }
}, 3000);





const { networkInterfaces } = require('os');

const nets = networkInterfaces();
const results = {}

for (const name of Object.keys(nets)) {
    for (const net of nets[name]) {
        // Skip over non-IPv4 and internal (i.e. 127.0.0.1) addresses
        if (net.family === 'IPv4' && !net.internal) {
            if (!results[name]) {
                results[name] = [];
            }
            results[name].push(net.address);
            console.log(results)
        }
    }
}

var os = require('os');

var networkInterface = os.networkInterfaces();

console.log(networkInterface);


    child.exec('@chcp 65001 >nul & netsh interface ipv4 show addresses',{encoding: "UTF-8"}, (err, stdout) => {

        let std = stdout.split(/\r?\n/);
        //console.log(std)
    });

    child.exec('@chcp 65001 >nul & netsh interface ipv4 show config',{encoding: "UTF-8"}, (err, stdout) => {

        let std = stdout.split(/\r?\n/);
        //console.log(std)
    });

window.themeCheck = () =>{
    let root = document.querySelector(':root');
    let rs = getComputedStyle(root)
    if(rs.getPropertyValue('--main')=="white"){
        darkTheme()
    }else{
        lightTheme()
    }
}

function darkTheme(){
    let root = document.querySelector(':root');
    root.style.setProperty('--main', '#171717');
    root.style.setProperty('--second', '#444444');
    root.style.setProperty('--font-color', '#f1f1f1');
    root.style.setProperty('--font', 'white');
    root.style.setProperty('--hover-buttons', '#3a3f44');
    root.style.setProperty('--tab', "#5d5d5d");
    root.style.setProperty('--invert-elem', 1);
}


function lightTheme(){
    let root = document.querySelector(':root');
    root.style.setProperty('--main', 'white');
    root.style.setProperty('--second', '#f1f1f1');
    root.style.setProperty('--font-color', '#3a3f44');
    root.style.setProperty('--font', 'black');
    root.style.setProperty('--hover-buttons', '#d8d8d8');
    root.style.setProperty('--tab', "#e0efff");
    root.style.setProperty('--invert-elem', 0);
}

if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    darkTheme()
}else{
    lightTheme()
}


const checkFetch2 = async () => {
    try{   
        const checkKeyResponse = await fetch(`https://chilly-newt-35.loca.lt/test`)
        const jsonData = await checkKeyResponse.json();
        console.log(jsonData)
    }catch (error) {
        console.log(error.message)
    }
}
//checkFetch2()



//config.OpenWith.Paths.push({"Name": "Notepad","path": "notepad"})
//config.OpenWith.Paths.pop()
///console.log(config.OpenWith)
//fs.writeFile('./Config/config.json', JSON.stringify(config, null, 2), err => {
  //if (err) {
    //console.error(err)
    //return
  //}
//})