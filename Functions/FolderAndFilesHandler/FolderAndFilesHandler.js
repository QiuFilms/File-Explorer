class FolderElement{
    constructor(){

    }

    createAndAppendAll(){
        let content = document.querySelector("#content");
        let folder = document.createElement("img");
        let name = document.createElement("p");
        let div = document.createElement("div");

        content.appendChild(div);
        div.appendChild(folder);
        div.appendChild(name);

        return {div, folder, name}
    }

    setFolderAttributes(div, folder, name, innerName, long, short, fdir,){
        div.setAttribute("id","folder_div");
        div.setAttribute("class","folder_div");
        div.setAttribute("oncontextmenu","cont(event,this)");
        div.setAttribute("draggable","true");
        div.setAttribute("ondragstart","dragStartFun(event)");
        div.setAttribute("ondrop","onDropFolder(event,this)");
        div.setAttribute("long",long);
        div.setAttribute("short",short);
        div.setAttribute("name",fdir)
        div.setAttribute("ondblclick","sessionStorage.setItem('folderPath',(this.attributes['name'].value));dirChange()")
        name.setAttribute("id","folder-name");
        name.innerHTML = innerName

        folder.setAttribute("src","Icons/logo.png");
    }
}


function Folder(files, x) {
    let FolderElem = new FolderElement();
    let {div, folder, name} = FolderElem.createAndAppendAll()
    let fdir = `/${files[x]}`

    if(files[x].length >10){
        var innerName = files[x].slice(0, 15)+"...";
        var short = files[x].slice(0, 15)+'...';

    }else{
        var short = files[x];
        var innerName = files[x];
    }
    FolderElem.setFolderAttributes(div, folder, name, innerName, files[x],short ,fdir)

}

export default Folder