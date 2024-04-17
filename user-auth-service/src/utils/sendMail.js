const nodemailer = require('nodemailer');
const {BadRequestError} = require('chordchat-common')
console.log(process.env.JWT_KEY)

async function sendMail(email, otp) {
          const transporter = nodemailer.createTransport({
                    service: 'gmail',
                    auth: {
                        user: process.env.MAIL_USER,
                        pass: process.env.MAIL_PASS 
                    }
                });
                
          console.log(email,otp)
    const mailOptions = {
        from: 'Chord-Chat<sydsfn123@gmail.com>',
        to: email,
        subject: `Verify your account!`,
        html: `<!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>OTP Verification</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    background-color: #f0f0f0;
                    margin: 0;
                    padding: 0;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    height: 100vh;
                   
                }
                .container {
                    background-color: #000000;
                    color: #ffffff;
                    border-radius: 8px;
                    padding: 20px;
                    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                    text-align: center;
                }
                .logo {
                    height: 300px;
                    width: 400px;
                    margin-bottom: 20px;
                }
                h1 {
                    color: #fffff;
                    margin-bottom: 20px;
                }
                h2 {
                    color: #fffff;
                    
                }
                .otp {
                    font-size: 24px;
                    font-weight: bold;
                    color: #ff0000;
                    padding: 10px;
                    border: 2px solid #007bff;
                    border-radius: 6px;
                    margin-bottom: 20px;
                    display: inline-block;
                }
                p {
                    color: #ffffff;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <img class="logo" src="https://res.cloudinary.com/dkxyzzuss/image/upload/v1713179137/wzz6p2h9fmlw2tdbdsdo.png" alt="Chord-Chat Logo">
                <h1>OTP Verification</h1>
                <h3>Let's jam together, share your talent on this platform.. Get to know your fellow stars, collab and create music together</h3>
                <div class="otp">${otp}</div>
                <p>The OTP for verification is displayed above. Please use this OTP to verify your account.</p>
            </div>
        </body>
        </html>        
        `
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent successfully', info.response);
        return info.response;
    } catch (error) {
        console.error('Error occurred when sending otp', error);
        throw new BadRequestError('Error occurred when sending otp');
    }
}

module.exports = {sendMail}
