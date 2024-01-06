require ('dotenv').config();
const nodemailer = require('nodemailer');

import { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {verificationToken, discordServerId, discordUserId, userEmail} = body;
    if (!verificationToken || !discordServerId || !discordUserId) {
      return new Response(JSON.stringify({ error: 'Missing required user information' }), {
        status: 400,
        headers: {
          "Content-Type": "application/json"
        }
      });
    }
    const url = `http://localhost:3000/verification/${verificationToken}?discordServerId=${discordServerId}&discordUserId=${discordUserId}`;
    const success = await sendMail(userEmail, url);
    if (success) {
      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: {
          "Content-Type": "application/json"
        }
      });
    } else {
      return new Response(JSON.stringify({ error: 'Internal server error' }), {
        status: 500,
        headers: {
          "Content-Type": "application/json"
        }
      });
    }
  } catch (e) {
    // ...error handling code
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}



async function sendMail(userEmail: string, verificationLink: string) {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: 'konner.programming@gmail.com',
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
        accessToken: process.env.GOOGLE_ACCESS_TOKEN,
      },
    });
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
      return true;
    } catch (error) {
      console.error('Error sending email:', error);
      return false;
    }
  }

