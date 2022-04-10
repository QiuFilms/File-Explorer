const HideContextMenus = () => {
    document.getElementById('contextMenu').style.display = 'none';
    document.getElementById("contextMenuFolder").style.display = 'none';
    document.getElementById("content-outer").appendChild(document.getElementById("contextMenuFolder"))
    document.getElementById("contextMenuFile").style.display = 'none';
    document.getElementById("content-outer").appendChild(document.getElementById("contextMenuFile"))

}

export default HideContextMenus;

