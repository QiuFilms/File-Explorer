class FolderElement{
    constructor(){

    }

    createAndAppendAll(){
        let content = document.querySelector("#content");
        let folder = document.createElement("img");
        let name = document.createElement("p");
        let date = document.createElement("p");
        let ext = document.createElement("p");
        let size = document.createElement("p");
        let div = document.createElement("div");

        content.appendChild(div);
        div.appendChild(folder);
        div.appendChild(name);
        div.appendChild(ext);
        div.appendChild(size);
        div.appendChild(date);


        return {div, folder, name, date, size, ext}
    }

    setFolderAttributes(div, folder, name, date, innerName, long, short, fdir, info){
        div.setAttribute("id","folder_div");
        div.setAttribute("class","folder_div");
        div.setAttribute("oncontextmenu","cont(event,this)");
        div.setAttribute("ondragstart","dragStartFun(event)");
        div.setAttribute("ondrop","onDropFolder(event,this)");
        div.setAttribute("long",long);
        div.setAttribute("short",short);
        div.setAttribute("name",fdir)
        name.setAttribute("id","folder-name");
        name.innerHTML = innerName

        date.setAttribute("class","info")
        let infoDate = info.birthtime.toString().split(" ")
        let creationDate = `${infoDate[1]} ${infoDate[2]} ${infoDate[3]}`

        let infoTime = infoDate[4].split(":")
        let time = `${infoTime[0]}:${infoTime[1]}`

        date.innerHTML = `${creationDate}  ${time}`

        folder.setAttribute("src","Icons/logo.png");
    }

    setFolderIfCloud(div,type="normal"){
        if(type == "cloud"){
            div.setAttribute("ondblclick","alert(123)")
            div.setAttribute("draggable","false");
        }else{
            div.setAttribute("ondblclick","sessionStorage.setItem('folderPath',(this.attributes['name'].value));dirChange()")
            div.setAttribute("draggable","true");
        }
    }

    setFileAttributes(div, folder, name, date, size, ext, innerName, long, short, fdir,icon, info, extension){
        div.setAttribute("id","folder_div");
        div.setAttribute("class","folder_div");
        div.setAttribute("oncontextmenu","cont(event,this)");
        div.setAttribute("draggable","true");
        div.setAttribute("ondragstart","dragStartFun(event)");
        div.setAttribute("ondrop","onDropFolder(event,this)");
        div.setAttribute("long",long);
        div.setAttribute("short",short);
        div.setAttribute("name",fdir)
        div.setAttribute("ondblclick",`openFile('"${fdir}"');`)
        name.setAttribute("id","folder-name");
        name.innerHTML = innerName

        date.setAttribute("class","infoRest")
        let infoDate = info.birthtime.toString().split(" ")
        let creationDate = `${infoDate[1]} ${infoDate[2]} ${infoDate[3]}`

        let infoTime = infoDate[4].split(":")
        let time = `${infoTime[0]}:${infoTime[1]}`

        date.innerHTML = `${creationDate}  ${time}`

        size.setAttribute("class","infoRest")

        if(info.size<1024){
            var properSize = info.size+" B"
        }

        console.log(info.size>=1024)
        if(info.size>=1024 && info.size<1048576){
            var properSize = (info.size/1024).toFixed(2)+" KB" 
        }

        if(info.size>=1048576 && info.size < 1073741824){
            var properSize = (info.size/1048576).toFixed(2)+" MB"
        }

        if(info.size>=1073741824){
            var properSize = (info.size/1073741824).toFixed(2)+" GB"
        }

        size.innerHTML = properSize

        ext.setAttribute("class","info")
        ext.innerHTML = extension

        folder.setAttribute("src",icon);
    }
}


function Folder(files,type,info,folderSize) {
    let FolderElem = new FolderElement();
    let {div, folder, name, date} = FolderElem.createAndAppendAll()
    let fdir = `/${files}`

    if(files.length >10){
        var innerName = files.slice(0, 15)+"...";
        var short = files.slice(0, 15)+'...';

    }else{
        var short = files;
        var innerName = files;
    }
    FolderElem.setFolderAttributes(div, folder, name, date, innerName, files,short ,fdir, info)
    FolderElem.setFolderIfCloud(div,type)
    console.log(info)
}

function FileCreate(files,info, extension){
    let FolderElem = new FolderElement();
    let {div, folder, name, date, size, ext} = FolderElem.createAndAppendAll()
    let fdir = sessionStorage.getItem('currentPath')+`/${files}`;

    if (files.length >10){
        var innerName = files.slice(0, 15)+"...";
        var short = files.slice(0, 15)+'...';
    }else{
        var short = files;
        var innerName = files;
    }

    var fileExt = files.split('.').pop().toLowerCase();
    if(fileExt == "txt"){
        var icon = "Icons/file3.png"
    }else if(fileExt == "js"){
        var icon = "Icons/js.png"
    }else if(fileExt == "json"){
        var icon = "Icons/json.png"
    }else if(fileExt == "png"){
        var icon = "Icons/png.png"
    }else if(fileExt == "jpg" || fileExt == "jpeg"){
        var icon = "Icons/jpg.png"
    }else if(fileExt == "gif"){
        var icon = "Icons/gif.png"
    }else if(fileExt == "html"){
        var icon = "Icons/html.png"
    }else if(fileExt == "css"){
        var icon = "Icons/css.png"
    }else if(fileExt == "bin" || fileExt == "log" || fileExt == "msi" || fileExt == "sys" || fileExt == "tmp" || fileExt == "ini" || fileExt == "dll"){
        var icon = "Icons/ddl.png"
    }else if(fileExt == "mp4" || fileExt == "avi"){
        var icon = "Icons/mp4.png"
    }else{
        var icon = "Icons/file.png"
    }

    FolderElem.setFileAttributes(div, folder, name, date, size,ext, innerName, files,short ,fdir,icon, info, extension)
    console.log(info)
}

export {Folder, FileCreate}