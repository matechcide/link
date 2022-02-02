const ejs = require('ejs')

module.exports = {
    html: (() => {
        return (/*html*/ `
            
        `)
    })(),

    render : (req, res) => {
        const parms = {
        }
        res.send({component: ejs.render(module.exports.html, parms)})
    }
}