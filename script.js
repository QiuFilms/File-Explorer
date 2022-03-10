const fs = require("fs");
const path = require('path');
const doc = document;
var spawn = require("child_process").spawn
const child = require('child_process');

//Imports
import listDrives from "./Functions/listDrives.js"
import createDiskElement from "./Functions/createDiskElement.js"
import ListStartDrives from "./Functions/listStartDrives.js";

//ListDrives
listDrives()

listDrives().then((data) => getDrives(data))

var x;
function getDrives(data) {
    for( x in data){
        createDiskElement(data,x)
    }
}


//CurrentPath
sessionStorage.setItem("currentPath","start");
sessionStorage.setItem("previousPath","start");


window.start = function(isFocused) {
    if(sessionStorage.getItem("currentPath")=="start"){
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
            let content = doc.querySelector("#content")

            let iter = data.length - 1;
            content.innerHTML = "<h2>Devices and drives<div></div></h2>"
            for(let x=0;x<=iter;x++){
                ListStartDrives(data,x)
            }
        } 
        listDrives().then((data) => startDrives(data))

    }else{

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
    
const pattern = new RegExp(/\.[0-9a-z]+$/i)
for(x in files1){

    var test = pattern.test(files1[x]);
    if(!test){
        Folder()
    }

}
for(x in files1){

    var test = pattern.test(files1[x]);
    if(test){
        File()
        
    }
}


function Folder() {
    let div = doc.createElement("div");
    div.setAttribute("id","folder_div");
    div.setAttribute("class","folder_div");
    div.setAttribute("oncontextmenu","");
    let content = doc.getElementById("content");
    content.appendChild(div);
    let folder = doc.createElement("img");
    folder.setAttribute("src","Icons/logo.png");
    div.appendChild(folder);
    let namef = doc.createElement("p");
    div.setAttribute("long",files1[x]);
    if (files1[x].length >10){
        
        namef.innerHTML=files1[x].slice(0, 15)+"...";
        div.setAttribute("short",files1[x].slice(0, 15)+'...');
    }else{
        div.setAttribute("short",files1[x]);
        namef.innerHTML=files1[x];
    }
    namef.setAttribute("id","folder-name");
    div.appendChild(namef);
    let fdir = `/${files1[x]}`
    div.setAttribute("name",fdir)
    div.setAttribute("onclick","sessionStorage.setItem('folderPath',(this.attributes['name'].value));dirChange()")
}

function File() {
    let div = doc.createElement("div");
    div.setAttribute("id","folder_div");
    div.setAttribute("class","folder_div");
    let content = doc.getElementById("content");
    content.appendChild(div);
    let file = doc.createElement("img");
    div.appendChild(file);
    let namef = doc.createElement("p");
    namef.setAttribute("id","folder-name");
    div.setAttribute("long",files1[x]);
    if (files1[x].length >10){
        
        namef.innerHTML=files1[x].slice(0, 15)+"...";
        div.setAttribute("short",files1[x].slice(0, 15)+'...');
    }else{
        div.setAttribute("short",files1[x]);
        namef.innerHTML=files1[x];
    }
    var fileExt = files1[x].split('.').pop().toLowerCase();
    if(fileExt == "txt"){
        file.setAttribute("src","Icons/file3.png")
    }else if(fileExt == "js"){
        file.setAttribute("src","Icons/js.png")
    }else if(fileExt == "json"){
            file.setAttribute("src","Icons/json.png")
    }else if(fileExt == "png"){
        file.setAttribute("src","Icons/png.png")
    }else if(fileExt == "jpg" || fileExt == "jpeg"){
        file.setAttribute("src","Icons/jpg.png")
    }else if(fileExt == "gif"){
        file.setAttribute("src","Icons/gif.png")
    }else if(fileExt == "html"){
        file.setAttribute("src","Icons/html.png")
    }else if(fileExt == "css"){
        file.setAttribute("src","Icons/css.png")
    }else if(fileExt == "bin" || fileExt == "log" || fileExt == "msi" || fileExt == "sys" || fileExt == "tmp" || fileExt == "ini" || fileExt == "dll"){
        file.setAttribute("src","Icons/ddl.png")
    }else if(fileExt == "mp4" || fileExt == "avi"){
        file.setAttribute("src","Icons/mp4.png")
    }else{
        file.setAttribute("src","Icons/file.png")
    }

    div.appendChild(namef);
    let fdir = sessionStorage.getItem('currentPath')+`/${files1[x]}`;
    div.setAttribute("name",fdir)
    div.setAttribute("onclick",`openFile('"${fdir}"');`)
}

window.openFile = function (fdir){
    child.exec(fdir)
}

function defineExtension(){
    var fileExt = files1[x].split('.').pop();
    
    if(fileExt == "txt"){
        file.setAttribute("src","Icons/file3.png")
    }else if(fileExt == "js"){
        file.setAttribute("src","Icons/js.png")
    }   
}

}

}
window.dirChange =  function () {
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
    
    start(0)
}
start(0)


function logButtons(e) {
    if(e.buttons==8){
        var fields = sessionStorage.getItem("currentPath").split('/');

        var last = fields[fields.length-1]

        var prev = sessionStorage.getItem("currentPath").replace("/"+last, '')

        sessionStorage.setItem("currentPath",prev);
        content.innerHTML = "";
        start()
    }
}

window.backClick =  function (){
        var fields = sessionStorage.getItem("currentPath").split('/');

        var last = fields[fields.length-1]

        var prev = sessionStorage.getItem("currentPath").replace("/"+last, '')

        sessionStorage.setItem("currentPath",prev);
        content.innerHTML = "";
        start()
    
}
document.addEventListener('mousedown', logButtons);


var box = document.querySelector("#content-outer");
var pageX = document.getElementById("x");
var pageY = document.getElementById("y");

window.updateDisplay =  function (event) {
    document.getElementById("contextMenu").style.display = "";
    document.getElementById("contextMenu").style.left=event.pageX-160+"px";
    document.getElementById("contextMenu").style.top=event.pageY-80+"px";
}

window.hide = function() {
    document.getElementById('contextMenu').style.display = 'none';
}

window.openCmd = function () {

        if(__dirname.slice(0,2)==sessionStorage.getItem("currentPath").slice(0,2)){
            child.exec(`cd ${sessionStorage.getItem("currentPath").slice(0,2)}/ & cd ${sessionStorage.getItem("currentPath")} & start cmd.exe`);
        }else{
            child.exec(`${sessionStorage.getItem("currentPath").slice(0,2)} & cd ${sessionStorage.getItem("currentPath")} & start cmd.exe`);
        }
}

function createFile() {
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


function createFolder() {
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

function deleteFile() {
    document.getElementById("delete").style.display = "";
    let input = document.getElementById("delete-input");
    let inpPath = sessionStorage.getItem("currentPath")+"/"+input.value;
    fs.unlinkSync(inpPath);

    content.innerHTML = "";
    input.value = "";
    document.getElementById("delete").style.display = "none";
    start()
}


function sortDown(){
    document.getElementById("content").style.flexDirection = "column";
    sessionStorage.setItem("view","down")
    let fold = document.getElementsByClassName("folder_div")
    let num = fold.length;
    for(let x = 0;x<num;x++){
        fold[x].style.flexDirection = "row";
        fold[x].style.maxWidth = "600px";
        fold[x].children[1].innerHTML = `${fold[x].getAttribute('long')}`
    }
}

function sortRight(){
    document.getElementById("content").style.flexDirection = "row";
    sessionStorage.setItem("view","right")
    let fold = document.getElementsByClassName("folder_div")
    let num = fold.length;
    for(let x = 0;x<num;x++){
        fold[x].style.flexDirection = "column";
        fold[x].style.maxWidth = "80px";
        fold[x].children[1].innerHTML = `${fold[x].getAttribute('short')}`
    }
}

function checkView(){
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
            li.innerHTML = `<div name='${folderCurrent[x]}' class='leftEl' onclick="leftFolderClick(this.getAttribute('name'))"><img src='Icons/logo.png'><p>${folderCurrent[x]}</p></img></div>`;
            ul.appendChild(li)
            i++
        }else if (x==1 && folderCurrent[x]==""){
        }else{
            let ul2 = document.createElement("ul")
            let li = document.createElement("li")
            li.setAttribute("id",`li${i}`)
            li.setAttribute("name",folderCurrent[x])
            li.innerHTML = `<div name='${folderCurrent[x]}' class='leftEl' onclick="leftFolderClick(this.getAttribute('name'))"><img src='Icons/logo.png'><p name='${folderCurrent[x]}' onclick="leftFolderClick(this.getAttribute('name'))")>${folderCurrent[x]}</p></img></div>`;
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