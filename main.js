const express = require('express')
const app = express()
const server = require('http').createServer(app)
const fs = require("fs")
const io = require("socket.io")(server)
const url = require('url')
const cookieParser = require('cookie-parser');
global.dir = __dirname

const modules = {}
fs.readdir(global.dir + '/modules', (err, files) => {
	files.forEach(file => {
		if (!file.endsWith('.js')) return
        modules[file.replace(".js", "")] = require(global.dir + `/modules/${file}`)
	})
})

global.functions = {}
fs.readdir(global.dir + '/functions', (err, files) => {
	files.forEach(file => {
		if (!file.endsWith('.js')) return
        global.functions[file.replace(".js", "")] = require(global.dir + `/functions/${file}`)
	})
})

global.components = {}
for(const folder of fs.readdirSync(global.dir + '/components')){
    global.components[folder] = {}
    for(const component of fs.readdirSync(global.dir + `/components/${folder}/`)){
        global.components[folder][component.replace(".js", "")] = require(global.dir + `/components/${folder}/${component}`)
    }
}

global.json = {}
fs.readdir(global.dir + '/json', (err, files) => {
	files.forEach(file => {
		if (!file.endsWith('.json')) return
        global.json[file.replace(".json", "")] = require(global.dir + `/json/${file}`)
	})
})

app.set('view engine', 'ejs')
app.set('views', global.dir + '/views');
app.use('/public', express.static(global.dir + '/public'))
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb'}))
app.set('trust proxy', true);
app.use(cookieParser());

app.use("*", (req, res) => {
    req.baseUrl = req.baseUrl.substring(1).split('/')
    req.argUrl = url.parse(req.url, true).query
    if(modules[req.baseUrl[0]] && modules[req.baseUrl[0]].httpAcces(req)){
        modules[req.baseUrl[0]][req.method](req, res)
    }
    else{
        res.redirect("/index" + req.url)
    }
})

io.on('connection', (socket) => {
    if(socket.handshake.auth.module && modules[socket.handshake.auth.module] && modules[socket.handshake.auth.module].socketAcces(socket.handshake.auth)){
        modules[socket.handshake.auth.module].socket(socket, io)
    }
    else{
        setTimeout(() => {
            socket.disconnect()
        }, 500)
    }
})

server.listen(4080, () => {
    console.log('Serving on port 4080');
})