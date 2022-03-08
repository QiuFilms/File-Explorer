var spawn = require("child_process").spawn
const child = require('child_process');
const d = document;


const createDiskElement = (data,x) => {
        let div = d.createElement("div")
        div.setAttribute("id","disk_div");
        let leftBar = d.getElementById("disks");
        leftBar.appendChild(div);
        let drive = d.createElement("img");
        drive.setAttribute("src","Icons/drive.png");
        div.appendChild(drive);
        let namef = d.createElement("p");
        namef.setAttribute("id","drive_name");
        namef.innerHTML = data[x];
        div.appendChild(namef);
        let dname = `${data[x]}/`
        div.setAttribute("name",dname)
        let content = d.getElementById("content");
        div.setAttribute("onclick","sessionStorage.setItem('currentPath',(this.attributes['name'].value));content.innerHTML = '';start()");
        label(data,namef,x);

        
}

function label(data,namef,x) {
    child.exec('@chcp 65001 >nul & cmd /d/s/c  vol '+data[x],{encoding: "UTF-8"}, (error, stdout) => {
        var fields = stdout.split(' ');
        if (fields[6]=="no"){
            let nameLabel = "";
            namef.innerHTML=namef.innerHTML+" "+nameLabel;
        }else if(fields[6]==undefined){
            let nameLabel = "Dysk sieciowy lub napęd";
            namef.innerHTML=namef.innerHTML+" "+nameLabel;
        }else{
            let nameLabel = fields[6];
            namef.innerHTML=namef.innerHTML+" "+nameLabel;
        }
    });
}


export default createDiskElement;