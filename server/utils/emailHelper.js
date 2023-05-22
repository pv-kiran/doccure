
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PWSWD
    } ,
    tls: {
        ciphers:'SSLv3'
    }
});

module.exports = transporter;