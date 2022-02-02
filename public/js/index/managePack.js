const startManagePack = async (pack) => {
    let rep = await toModule("getPackFile", {file: "pack.json"})
    rep = JSON.parse(atob(rep.base64))

    seeInfo("Début des verification.")
    async function countFile(sp, cp){
        let count = 0
        for(let index = 0; sp.listFolder[index]; index++){
            const folder = sp.listFolder[index]
            count += await countFile(sp.folders[folder], cp.folders[folder])
        }
        for(let index = 0; sp.listFile[index]; index++){
            const file = sp.listFile[index]
            if(!await fileExist(sp.path + "/" + file) || sp.files[file] != cp.files[file]){
                count++
            }
        }
        return count
    }
    let numFiles = await countFile(rep, pack)

    if(numFiles != 0){
        let count = 0
        async function verif(sp, cp){
            for await(const file of await loopDir(sp.path)){
                if(file.isDirectory && !sp.folders[file.name]){
                    removeDir(sp.path + "/" + file.name)
                }
                else if(file.isFile && !sp.files[file.name]){
                    removeFile(sp.path + "/" + file.name)
                }
            }
            for(let index = 0; sp.listFolder[index]; index++){
                const folder = sp.listFolder[index]
                if(!await folderExist(sp.path + "/" + folder)){
                    await createDir(sp.path + "/" + folder)
                }
                await verif(sp.folders[folder], cp.folders[folder])
            }
            for(let index = 0; sp.listFile[index]; index++){
                const file = sp.listFile[index]
                if(!await fileExist(sp.path + "/" + file)){
                    let rep = await toModule("getPackFile", {file: sp.path + "/" + file})
                    await writeFile(sp.path + "/" + file, rep.base64)
                    count++
                }
                else if(sp.files[file] != cp.files[file]){
                    let rep = await toModule("getPackFile", {file: sp.path + "/" + file})
                    await writeFile(sp.path + "/" + file, rep.base64)
                    count++
                }
                seeInfo("Téléchargement des fichier : " + count + "/" + numFiles);
            }
            return
        }
        await verif(rep, pack)
    }
}