seeInfo("Acceptez l'accès au stockage.")

launchFileSystem(10000000000).then(async (result) => {
    if(!result) location.reload()

    if(await fileExist("../pack.json")){
        await removeFile("../pack.json")
    }

    if(!await fileExist("../pack.json")){
        seeInfo("Téléchargement de la fiche du pack.")
        let rep = await toModule("getPackFile", {file: "pack.json"})
        await writeFile("../pack.json", rep.base64)
    }

    const pack = await readFile("../pack.json");
    await startManagePack(pack)
    let temp = await toModule("getPackFile", {file: "pack.json"})
    await writeFile("../pack.json", temp.base64)
    deleteInfo()
    await toModule("getSession")
    window.location.href = "/game"
})