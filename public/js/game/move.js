let tempo = false
document.addEventListener("keydown", (event) => {
    if(tempo) return
    tempo = true
    setTimeout(() => {
        tempo = false
    }, 480);
    if(event.key == 'Z'){
        socket.emit('turn', 'top');
    }
    else if(event.key == 'Q'){
        socket.emit('turn', 'left');
    }
    else if(event.key == 'S'){
        socket.emit('turn', 'bottom');
    }
    else if(event.key == 'D'){
        socket.emit('turn', 'right');
    }
    else if(event.key == ' '){
        socket.emit('attack');
    }
    else if(event.key == 'z'){
        moove = 'z';
        socket.emit('move', 'top');
    }
    else if(event.key == 'q'){
        moove = 'q';
        socket.emit('move', 'left');
    }
    else if(event.key == 's'){
        moove = 's';
        socket.emit('move', 'bottom');
    }
    else if(event.key == 'd'){
        moove = 'd';
        socket.emit('move', 'right');
    }
});

socket.on("quit", (player) => {
    if(document.getElementById(player)){
        document.getElementById(player).remove()
    }
})

socket.on("join", () => {
    socket.emit('turn', 'bottom');
})

socket.on("nextPlateau", (plateau, dir) => {
    document.getElementById("player").innerHTML = ""
    loadPlateau(plateau)
})

socket.on("attack", (name, dir, x, y) => {
    canvanPlayer(name)
    let num = 1;
    const interval = setInterval(function () {
        document.getElementById(name).getContext('2d').clearRect(0, 0, 832, 832);
        if(name == playerName){
            let metrics = document.getElementById(name).getContext('2d').measureText("MOI");
            document.getElementById(name).getContext('2d').fillText("MOI", x + 32 - (metrics.width / 2), y+10);
        }
        else{
            let metrics = document.getElementById(name).getContext('2d').measureText(name);
            document.getElementById(name).getContext('2d').fillText(name, x + 32 - (metrics.width / 2), y+10);
        }
        if(num >= 7){
            document.getElementById(name).getContext('2d').drawImage(images["/body/" + dir + "/0.png"], x, y);
            clearInterval(interval);
            return;
        }
        document.getElementById(name).getContext('2d').drawImage(images["/body/" + dir + "A/" + num + ".png"], x-64, y-64);
        num++;
    }, 60);
});

socket.on("move", (name, dir, x, y) => {
    canvanPlayer(name)
    if(dir == "top"){
        y += 64;
    }
    else if(dir == "left"){
        x += 64;
    }
    else if(dir == "bottom"){
        y -= 64;
    }
    else if(dir == "right"){
        x -= 64;
    }

    let num = 1;

    const interval = setInterval(function () {

        if(dir == "top"){
            y -= 8;
        }
        else if(dir == "left"){
            x -= 8;
        }
        else if(dir == "bottom"){
            y += 8;
        }
        else if(dir == "right"){
            x += 8;
        }

        document.getElementById(name).getContext('2d').clearRect(0, 0, 832, 832);
        if(name == playerName){
            let metrics = document.getElementById(name).getContext('2d').measureText("MOI");
            document.getElementById(name).getContext('2d').fillText("MOI", x + 32 - (metrics.width / 2), y+10);
        }
        else{
            let metrics = document.getElementById(name).getContext('2d').measureText(name);
            document.getElementById(name).getContext('2d').fillText(name, x + 32 - (metrics.width / 2), y+10);
        }
        if(num >= 8){
            document.getElementById(name).getContext('2d').drawImage(images["/body/" + dir + "/0.png"], x, y);
            clearInterval(interval);
            return;
        }
        document.getElementById(name).getContext('2d').drawImage(images["/body/" + dir + "/" + num + ".png"], x, y);
        num++;
    }, 60);
});

socket.on("turn", (name, dir, x, y) => {
    canvanPlayer(name)
    document.getElementById(name).getContext('2d').clearRect(0, 0, 832, 832);
    document.getElementById(name).getContext('2d').drawImage(images["/body/" + dir + "/0.png"], x, y);
    if(name == playerName){
        let metrics = document.getElementById(name).getContext('2d').measureText("MOI");
        document.getElementById(name).getContext('2d').fillText("MOI", x + 32 - (metrics.width / 2), y+10);
    }
    else{
        let metrics = document.getElementById(name).getContext('2d').measureText(name);
        document.getElementById(name).getContext('2d').fillText(name, x + 32 - (metrics.width / 2), y+10);
    }
});

function canvanPlayer(name){
    if(!document.getElementById(name)){
        let temp = document.createElement("canvas")
        temp.className = "char"
        temp.id = name
        temp.height = 832
        temp.width = 832
        if(playerName == name){
            temp.getContext('2d').font = "10px Arial"
            temp.getContext('2d').fillStyle = "white";
        }
        else{
            temp.getContext('2d').font = "8px Arial"
        }
        document.getElementById("player").appendChild(temp)
    }
    return
}