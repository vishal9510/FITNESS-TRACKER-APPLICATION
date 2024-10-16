const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: "smtp.mailtrap.io",
    port: 587,
    auth: {
        user: "vishalsavaliya2912@gmail.com",
        pass: "savalya@123##",
    },
});

const sendEmail = async () => {
    const mailOptions = {
        from: 'vishalsavaliya2912@gmail.com',
        to: "hevin@gmail.com",
        subject: "Hello",
        text: "Hello from vishalsavaliya",
    };

    await transporter.sendMail(mailOptions);
};



module.exports = sendEmail;
