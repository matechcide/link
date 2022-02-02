module.exports = {
    GET: (req, res) => {
        switch(req.baseUrl[1]){
            case "":
                res.render(req.baseUrl[0] + "/" + req.baseUrl[1], {modules: req.baseUrl[0], page: req.baseUrl[1], cookie: req.cookie, title: "", scripts: []})
                break;
        
            default:
                res.render(req.baseUrl[0] + "/" + req.baseUrl[0], {modules: req.baseUrl[0], page: req.baseUrl[0], cookie: req.cookie, title: "link", scripts: ["toModule", "info", "fs", "loc"]})
                break;
        }

    },
    POST: (req, res) => {
        switch(req.headers.action){
            case "components":
                global.components[req.baseUrl[0]][req.baseUrl[1]].render(req, res)
                break;
        
            default:
                break;
        }

    },
    httpAcces: (req) => {
        if(global.functions.token.exist("user", req.cookies.token, true)){
            return true
        }
        else{
            return false
        }
        
    },
    socket: (socket, io) => {
        let auth = socket.handshake.auth
        if(global.functions.token.cdt("user", auth.token, (obj) => {
            if(obj.socket && obj.socket.connected){
                return true
            }
            return false
        }, true)){
            setTimeout(() => {
                socket.disconnect()
            }, 500)
            return
        }

        global.functions.token.set("user", auth.token, {socket: {set: socket}}, true)

        socket.on("turn", (dir) => {
            let player = global.functions.token.set("user", auth.token, {dir: {set: dir}})
            io.to(player.PX + ":" + player.PY).emit("turn", player.name, dir, player.X, player.Y)
        })

        socket.on("move", (dir) => {
            let x = 0
            let y = 0
            if(global.functions.token.cdt("user", auth.token, (obj) => {
                if(Date.now() - obj.lm >= 480){
                    return false
                }
                return true
            }, true)){
                return
            }
            let player = global.functions.token.set("user", auth.token, {lm: {set: Date.now()}})
            if(dir == "top"){
                y -= 64
            }
            else if(dir == "bottom"){
                y += 64
            }
            else if(dir == "right"){
                x += 64
            }
            else if(dir == "left"){
                x -= 64
            }
            player = global.functions.token.get("user", auth.token, true)
            global.functions.mongodb.findOne("map", {name: player.PX + ":" + player.PY},
            {
                projection: {
                    _id: 0,
                    [`plateau.${player.X + x}!${player.Y + y}.1`]: 1
                }
            }).then((rep) => {
                if(rep.plateau[Math.round(player.X+x) + "!" + Math.round(player.Y+y)] && rep.plateau[Math.round(player.X+x) + "!" + Math.round(player.Y+y)][1]){
                    io.to(player.PX + ":" + player.PY).emit("turn", player.name, dir, player.X, player.Y)
                    global.functions.token.set("user", auth.token, {dir: {set: dir}})
                    return
                }
                let px = 0
                let py = 0
                if(player.X+x > 768){
                    px += 1
                    x -= 832
                }
                else if(player.X+x < 0){
                    px -= 1
                    x += 832
                }
                else if(player.Y+y > 768){
                    py += 1
                    y -= 832
                }
                else if(player.Y+y < 0){
                    py -= 1
                    y += 832
                }
                player = global.functions.token.set("user", auth.token, {X: {add: x}, Y: {add: y}, PX: {add: px}, PY: {add: py}, dir: {set: dir}})
                if(px != 0 || py != 0){
                    global.functions.mongodb.findOne("map", {name: player.PX + ":" + player.PY},
                    {
                        projection: {
                            _id: 0
                        }
                    }).then((rep) => { 
                        if(!rep){
                            rep = global.functions.generate(player.PX + ":" + player.PY)
                        }
                        else{
                            rep = rep.plateau
                        }
                        socket.leave(Math.round(player.PX-px) + ":" + Math.round(player.PY-py))
                        socket.join(player.PX + ":" + player.PY);
                        socket.emit("nextPlateau", rep)
                        io.to(player.PX + ":" + player.PY).emit("turn", player.name, dir, player.X, player.Y)
                        setTimeout(() => {
                            io.to(player.PX + ":" + player.PY).emit("join", player.name)
                            io.to(Math.round(player.PX-px) + ":" + Math.round(player.PY-py)).emit("quit", player.name)
                        }, 100);
                    })
                }
                else{
                    io.to(player.PX + ":" + player.PY).emit("move", player.name, dir, player.X, player.Y)
                }
            })
        })

        socket.on("attack", () => {
            let x = 0
            let y = 0
            if(global.functions.token.cdt("user", auth.token, (obj) => {
                if(Date.now() - obj.lm >= 480){
                    return false
                }
                return true
            }, true)){
                return
            }
            let player = global.functions.token.set("user", auth.token, {lm: {set: Date.now()}}, true)
            if(player.dir == "top"){
                y -= 64
            }
            else if(player.dir == "bottom"){
                y += 64
            }
            else if(player.dir == "right"){
                x += 64
            }
            else if(player.dir == "left"){
                x -= 64
            }
            global.functions.mongodb.findOne("map", {name: player.PX + ":" + player.PY},
            {
                projection: {
                    _id: 0,
                    [`plateau.${player.X + x}!${player.Y + y}.1`]: 1
                }
            }).then((rep) => {
                if(rep.plateau[Math.round(player.X+x) + "!" + Math.round(player.Y+y)][1]){
                    io.to(player.PX + ":" + player.PY).emit("attack", player.name, player.dir, player.X, player.Y)
                    io.to(player.PX + ":" + player.PY).emit("arbreA", player.X+x, player.Y+y)
                    return
                }
                io.to(player.PX + ":" + player.PY).emit("attack", player.name, player.dir, player.X, player.Y)
            })
            
        })

        socket.on("disconnect", () => {
            let player = global.functions.token.set("user", auth.token, {socket: "delete"}, true)
            io.to(player.PX + ":" + player.PY).emit("quit", player.name)
            global.functions.mongodb.replaceOne("user", {ip: socket.handshake.headers["x-forwarded-for"]}, player).then(() => {
                global.functions.token.delete("user", auth.token)
            })
        })

        let player = global.functions.token.get("user", auth.token, true)
        global.functions.mongodb.findOne("map", {name: player.PX + ":" + player.PY},
        {
            projection: {
                _id: 0
            }
        }).then((rep) => { 
            if(!rep){
                rep = global.functions.generate(player.PX + ":" + player.PY)
            }
            else{
                rep = rep.plateau
            }
            socket.join(player.PX + ":" + player.PY);
            socket.emit("start", rep, player.name)
            setTimeout(() => {
                io.to(player.PX + ":" + player.PY).emit("join", player.name)
            }, 100);
        })

    },
    socketAcces: (auth) => {
        if(global.functions.token.exist("user", auth.token, true)){
            return true
        }
        else{
            return false
        }
        
    }
}