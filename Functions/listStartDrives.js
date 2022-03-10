const doc = document;

class Element {
    constructor({ElemDiv,FolderElem,ElemName,ContentElem,Paragraph},ImgSrc) {
        this.ElemDiv = ElemDiv;
        this.ImgSrc= ImgSrc;
        this.ElemName = ElemName;
        this.ContentElem = ContentElem;
        this.FolderElem = FolderElem;
        this.Paragraph = Paragraph;
    }

    DivOper(){
        this.ElemDiv.setAttribute("class","startDisk");
        this.ElemDiv.setAttribute("name",`${this.ElemName}/`)
        this.ElemDiv.setAttribute("onclick","sessionStorage.setItem('currentPath',(this.attributes['name'].value));content.innerHTML = '';start()")
    }

    ParagraphInner(){
        this.Paragraph.innerHTML="Dysk: "+this.ElemName;
    }

    FolderOper(){
        this.FolderElem.setAttribute("src",this.ImgSrc)
    }

    ApeandAll(){
        this.ContentElem.appendChild(this.ElemDiv);
        this.ElemDiv.appendChild(this.FolderElem);
        this.ElemDiv.appendChild(this.Paragraph);
    }
}



const ListStartDrives = (data,x) => {

    const img = ["Icons/drive_sys.png","Icons/drive2.png"]
    const AllElems = {
        ElemDiv: doc.createElement("div"),
        FolderElem: doc.createElement("img"),
        ElemName: data[x],
        ContentElem: content,
        Paragraph: doc.createElement("p"),
    } 

    if(data[x].includes(__dirname)){
    }else
    {
        if(data[x]=="C:"){
            var elem = new Element(AllElems,img[0]);
        }else{
            var elem = new Element(AllElems,img[1]);
        }

        elem.DivOper();
        elem.ParagraphInner();
        elem.FolderOper()
        elem.ApeandAll();
    }
}

export default ListStartDrives;