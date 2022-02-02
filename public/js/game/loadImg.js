const images = {}

async function loadImg(){
    const pack = await readFile("../pack.json");
    async function load(pack){
        for(let index = 0; pack.listFile[index]; index++){
            if(pack.listFile[index].indexOf(".png") == -1) continue
            const name = pack.path.replace(".", "") + "/" + pack.listFile[index]
            await new Promise((resolve) => {
                images[name] = new Image();
                images[name].onload = () => {
                    resolve()
                }
                images[name].src = "filesystem:" + window.location.origin + "/temporary/temp" + name
            })
        }
        for(let index = 0; pack.listFolder[index]; index++){
            await load(pack.folders[pack.listFolder[index]])
        }
        return
    }
    await load(pack)
}