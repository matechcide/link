seeInfo("Connexion en cours.")
const socket = io({
    reconnection: false,
    auth: {
        token: document.cookie.split("=")[1],
        module: loc.path[0]
    }
});
let playerName = ""

socket.on("start", (plateau, name) => {
    launchFileSystem().then(async (result) => {
        if(!result){
            socket.disconnect()
            return
        }
        playerName = name
        seeInfo("Chargement des images.")
        await loadImg()
        loadPlateau(plateau)
        socket.emit("turn", "bottom")
        deleteInfo()

    })
})

socket.on("disconnect", () => {
    seeInfo("Vous avez été déconnecté.")
    document.cookie = ""
})

