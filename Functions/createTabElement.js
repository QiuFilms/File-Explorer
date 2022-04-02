const doc = document;

class TabElement {
    constructor({MainElem,ElemTab,ElemTabName,TabName,ElemTabClose,CloseTab,CloseTabPng,Path,CurrentTab,TabId}){
        this.MainElem = MainElem;
        this.ElemTab = ElemTab;
        this.ElemTabName= ElemTabName;
        this.TabName = TabName;
        this.ElemTabClose = ElemTabClose;
        this.CloseTab = CloseTab;
        this.CloseTabPng = CloseTabPng;
        this.Path = Path;
        this.CurrentTab = CurrentTab;
        this.TabId = TabId
    }



    setImg(){
        this.CloseTab.src=this.CloseTabPng
    }   

    AppendAll(){
        this.MainElem.insertBefore(this.ElemTab,doc.querySelector("#addTab"))

        this.ElemTab.appendChild(this.ElemTabName)
        this.ElemTab.setAttribute("path",this.Path)
        this.ElemTab.setAttribute("onclick","changeTab(this.id,this.attributes['path'].value)")
        this.ElemTab.setAttribute("ondragover","setTimeout(changeTab(this.id,this.attributes['path'].value),1000)")
        this.ElemTab.setAttribute("TabName",this.CurrentTab)
        this.ElemTabName.innerHTML = this.TabName

        this.ElemTab.appendChild(this.ElemTabClose)

        this.ElemTabClose.appendChild(this.CloseTab)
        this.ElemTabClose.setAttribute("onclick","removeTab(this);")


    }

    setClassesAndIds(){
        doc.querySelectorAll(".tab").forEach(el => {
            el.classList.remove("tab-active")
        });
        
        this.ElemTab.classList = "tab tab-active"
        this.ElemTab.id = this.TabId


        this.ElemTabName.classList = "tab_name"
        this.ElemTabClose.classList = "tab_close"
    }

}



const CreateTabElement = (TabName, TabId) => {

    const AllElems = {
        MainElem: doc.querySelector("#tabs"),
        ElemTab: doc.createElement("div"),
        ElemTabName: doc.createElement("div"),
        TabName: TabName,
        TabId:TabId,
        ElemTabClose: doc.createElement("div"),
        CloseTab: doc.createElement("img"),
        CloseTabPng: "Misc/close.png",
        Path: sessionStorage.getItem('currentPath'),
        CurrentTab: sessionStorage.getItem("CurrentTab")
    } 

    var TabElem = new TabElement(AllElems);

    TabElem.setImg()
    TabElem.AppendAll()
    TabElem.setClassesAndIds()
}

export default CreateTabElement;
