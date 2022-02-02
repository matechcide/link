const fs = require("fs")
const files = {}

module.exports = {
    startUpLoad: (body, path) => {
        files[body.id] = {
            name: body.name,
            path: path,
            av: 0,
            cut: {

            }
        }
        fs.writeFileSync(global.dir + "/temp/upLoad/" + body.id, "", "base64")
        return
    },
    startCut: (body, path) => {
        files[body.id].cut[body.index] = {
            chunk: "",
            status: false
        }
        return
    },
    upLoadChunk: (body, path) => {
        files[body.id].cut[body.index].chunk += body.chunk
        return
    },
    endCut: (body, path) => {
        files[body.id].cut[body.index].status = true
        if(body.index == files[body.id].av){
            let temp = 0
            for(let index = body.index; files[body.id].cut[index] && files[body.id].cut[index].status; index++){
                fs.appendFileSync(global.dir + "/temp/upLoad/" + body.id, files[body.id].cut[index].chunk, "base64")
                delete files[body.id].cut[index]
                temp++
            }
            files[body.id].av += temp
        }
        return
    },
    endUpLoad: (body, path) => {
        fs.renameSync(global.dir + "/temp/upLoad/" + body.id, path + files[body.id].name)
        delete files[body.id]
        return
    },
}