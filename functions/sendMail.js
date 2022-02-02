/*const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: "appliskb@gmail.com",
        pass: '/SKB1309'
    }
});

const listSend = {}
const listMail = []

module.exports = async (email, subject, text) => {
    return await new Promise((resolve) => {
        let obj = {
            name: email + Date.now(),
            email: email,
            subject: subject,
            text: text
        }
        listMail.push(obj)
        const interval = setInterval(() => {
            if(listSend[obj.name]){
                let temp = listSend[obj.name]
                delete listSend[obj.name]
                resolve(temp)
            }
        }, 50);
    })
}

(function sendMail(){
    if(listMail[0]){
        let temp = listMail[0]
        listMail.splice(0, 1)
        let mailOptions = {
            from: transporter.transporter.auth.user,
            to: temp.email,
            subject: temp.subject,
            text: temp.text
        }

        transporter.sendMail(mailOptions, (error, info) => {
            if(error){
                listSend[temp.name] = {
                    status: "error",
                    info: error
                }
            }
            else{
                listSend[temp.name] = {
                    status: "successful"
                }
            }
            setTimeout(() => {
                sendMail()
            }, 10);
        })
    }
    else{
        setTimeout(() => {
            sendMail()
        }, 100);
    }
})()*/