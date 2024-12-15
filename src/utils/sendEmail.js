const nodeMailer = require('nodemailer');


const transporter = nodeMailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_SENDER ,
        pass: process.env.EMAIL_PASSWORD
    }
});

module.exports = async (otp, userEmail) => {
    const mailOptions = {
        from: process.env.EMAIL_SENDER,  
        to: userEmail,        
        subject: 'Forgot Password',    
        html: `
        <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px; border-radius: 10px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); text-align: center;">
            <div style="margin-top: 20px;">
                <h3 style="color: #000; font-weight: bold;">Forgot Password<br></h3>
                <p style="color: #666;">Your verification code is:<br></p>
                <p style="color: #333; font-size: 24px; font-weight: bold;">${otp}</p>
                <p style="margin-top: 20px;"> It will expire in 10 minutes.</p>
                <p style="margin-top: 20px;">Thank you,<br>Restaurant Team</p>
            </div>
        </div>
        `
    };
    
    
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
            return false;
        } else {
            console.log('Email sent: ' + info.response);
            return true;
        }
    });
}

