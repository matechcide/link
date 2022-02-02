const fs = require("fs")

const pack = (() => {
    function readDir(path){
        const json = {
            path: path.replace(global.dir + "/pack", "."),
            listFile: [],
            listFolder: [],
            folders: {},
            files: {}
        }
        for(const file of fs.readdirSync(path)){
            if(fs.lstatSync(path + "/" + file).isDirectory()){
                json.listFolder.push(file)
                json.folders[file] = readDir(path + "/" + file)
            }
            else{
                json.listFile.push(file)
                json.files[file] = fs.lstatSync(path + "/" + file).mtimeMs
            }
        }
        return json
    }
    return readDir(global.dir + "/pack")
    
})()
fs.writeFileSync(global.dir + "/pack/pack.json", JSON.stringify(pack))

module.exports = {

}