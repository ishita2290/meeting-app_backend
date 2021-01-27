const nodemailer = require('nodemailer');
const sendEmail = async (options) => {    
  
    
    let transporter = nodemailer.createTransport({
        host : process.env.SMTP_HOST,
        // port : process.env.SMTP_PORT,
        // secure : false, // true 465 , false for other ports
     
        auth : {
            user:process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
        },
        tls: {
         rejectUnauthorized: false 
        }
    });
     
   const message = {
    from: `"${process.env.FROM_NAME} " <${process.env.FROM_EMAIL}>`, // sender address
    to: options.email, // list of receivers
    subject: options.subject, // Subject line
    text: options.text, // plain text body
    html: options.html, // html body
  }
    let info = await transporter.sendEmail(message);
  
    console.log("Message sent: %s", info.messageId);    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
  
   
  }
  module.exports = sendEmail;