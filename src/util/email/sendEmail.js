

import nodemailer from 'nodemailer'


const sendEmail = async ({ to, subject, text, html, attachments = [] } = {}) => {

    const transporter = nodemailer.createTransport({
        service: "gmail",
        secure: true,
        auth: {
            user: process.env.EMAIL,
            pass: process.env.EMAIL_PASSWORD
        }
    });

    const info = await transporter.sendMail({
        from: `"BOOK STORE 👻" <${process.env.EMAIL}>`,
        to,
        // bcc: "anahammo777@gmail.com",
        subject,
        text,
        html,
        attachments
    });
    console.log(info);
}


export default sendEmail;