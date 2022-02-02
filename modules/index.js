const fs = require('fs')

module.exports = {
    GET: (req, res) => {
        switch(req.baseUrl[1]){
            case "":
                res.render(req.baseUrl[0] + "/" + req.baseUrl[1], {modules: req.baseUrl[0], page: req.baseUrl[1], cookie: req.cookie, title: "", scripts: []})
                break;
        
            default:
                res.render(req.baseUrl[0] + "/" + req.baseUrl[0], {modules: req.baseUrl[0], page: req.baseUrl[0], cookie: req.cookie, title: "link", scripts: ["toModule", "fs", "info"]})
                break;
        }

    },
    POST: (req, res) => {
        switch(req.headers.action){
            case "components":
                global.components[req.baseUrl[0]][req.baseUrl[1]].render(req, res)
                break;
            
            case "getPackFile":
                res.send({
                    base64: fs.readFileSync(global.dir + "/pack/" + req.body.file, "base64")
                })
                break;

            case "getSession":
                global.functions.mongodb.findOne("user", {ip: req.ip}, 
                {
                    projection: {
                        _id: 0
                    }
                }).then((rep) => {
                    let token
                    if(!rep){
                        let temp = {
                            X: 0,
                            Y: 0,
                            PX: 0,
                            PY: 0,
                            name: Date.now(),
                            ip: req.ip,
                            lm: 0,
                            dir: "dow"
                        }
                        global.functions.mongodb.insertOne("user", temp)
                        token = global.functions.token.make("user", temp)
                    }
                    else{
                        if(global.functions.token.search("user", {ip: req.ip})){
                            res.send({status: "error"})
                            return
                        }
                        token = global.functions.token.make("user", rep)
                    }
                    res.cookie("token", token)
                    res.send({})
                    
                })
                break;

            default:
                break;
        }

    },
    httpAcces: (req) => {
        return true
    },
    socket: (socket, auth) => {

    },
    socketAcces: (headers) => {
        return true
    }
}