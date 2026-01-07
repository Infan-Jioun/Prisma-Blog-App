import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
const nodemailer = require("nodemailer");
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // Use true for port 465, false for port 587
  auth: {
    user: process.env.APP_USER,
    pass: process.env.APP_PASS,
  },
});

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql", // or "mysql", "postgresql", ...etc
  }),
  trustedOrigins: [process.env.APP_URL!],
  user: {
    additionalFields: {
      role: {
        type: "string",
        defaultValue: "USER",
        required: false
      },
      phone: {
        type: "string",
        required: false
      },
      status: {
        type: "string",
        defaultValue: "Active",
        required: false
      }
    }
  },
  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
    requireEmailVerification: true
  },
  emailVerification: {
    sendOnSignUp : true,
 
    sendVerificationEmail: async ({ user, url, token }, request) => {
      
      try {
        const verificationUrl = `${process.env.APP_URL}/verify-email?token=${token}`
        const info = await transporter.sendMail({
          from: '"Prisma Blog App" <prisma@blog.com>',
          to: user.email,
          subject: "Verify Your Email Address - Prisma Blog App",
          text: `Hello ${user.name || 'User'},\n\nPlease verify your email by clicking this link: ${url}\n\nIf you didn't request this, ignore this email.\n\nThanks,\nPrisma Blog Team`,
          html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Verify Your Email</title>
      </head>
      <body style="margin: 0; padding: 0; background-color: #f4f4f4; font-family: Arial, sans-serif;">
        <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; margin: 30px auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
          <!-- Header -->
          <tr>
            <td align="center" style="padding: 40px 20px; background-color: #4f46e5; color: #ffffff;">
              <h1 style="margin: 0; font-size: 28px;">Prisma Blog App</h1>
              <p style="margin: 10px 0 0; font-size: 16px; opacity: 0.9;">Welcome to our community!</p>
            </td>
          </tr>
          
          <!-- Body -->
          <tr>
            <td style="padding: 40px 30px; text-align: center;">
              <h2 style="font-size: 24px; color: #333333; margin-bottom: 20px;">Verify Your Email Address</h2>
              <p style="font-size: 16px; color: #555555; line-height: 1.6; margin-bottom: 30px;">
                Hello <strong>${user.name || 'there'}</strong>,<br><br>
                Thank you for signing up! To complete your registration and start exploring, please verify your email address by clicking the button below.
              </p>
              
              <!-- CTA Button -->
              <a href="${verificationUrl}" target="_blank" style="display: inline-block; padding: 14px 32px; background-color: #4f46e5; color: #ffffff; font-size: 18px; font-weight: bold; text-decoration: none; border-radius: 6px; margin: 20px 0;">
                Verify Email Now
              </a>
              
              <p style="font-size: 14px; color: #888888; margin-top: 30px;">
                Or copy and paste this link into your browser:<br>
                <a href="${verificationUrl}" style="color: #4f46e5; word-break: break-all;">${url}</a>
              </p>
              
              <p style="font-size: 14px; color: #888888; margin-top: 40px;">
                If you didn't create an account, you can safely ignore this email.
              </p>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td align="center" style="padding: 30px; background-color: #f9fafb; font-size: 14px; color: #999999;">
              <p style="margin: 0;">© 2026 Prisma Blog App. All rights reserved.</p>
              <p style="margin: 10px 0 0;">If you have any questions, contact us at support@prismablog.com</p>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `,
        });

        console.log("Verification email sent: ", info.messageId);
      } catch (err) {
        console.error(err);
        throw err;
      }

    },
  }

});