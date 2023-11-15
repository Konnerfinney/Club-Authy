require ('dotenv').config();
require { nodemailer } from 'nodemailer';
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      type: 'OAuth2',
      user: 'konner.programming@gmail.com',
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
    },
  });

async function sendMail(userEmail, verificationToken) {
    let mailOptions = {
      from: 'konner.programming@gmail.com',
      to: userEmail,
      subject: 'Verify Your Email',
      html: `
        <p>Please click the link below to verify your email:</p>
        <a href="${verificationLink}">Verify Email</a>
        <p>If you did not request this, please ignore this email.</p>
      `,
    };
  
    try {
      let info = await transporter.sendMail(mailOptions);
      console.log('Email sent: %s', info.messageId);
    } catch (error) {
      console.error('Error sending email:', error);
    }
  }