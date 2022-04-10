const spawn = require("child_process").spawn
const ListDrives = () => {
    const list  = spawn('cmd');

    return new Promise((resolve, reject) => {
        list.stdout.on('data', function (data) {
            const output =  String(data)
            const out = output.split("\r\n").map(e=>e.trim()).filter(e=>e!="")
            if (out[0]==="Name"){
                resolve(out.slice(1))
            }
        });


        list.stdin.write('wmic logicaldisk get name\n');
        list.stdin.end();
        
    })
}

export default ListDrives