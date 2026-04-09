import dotenv from "dotenv";
dotenv.config();

import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  host: "smtp.mail.yahoo.com",
  port: 465, // or 587
  secure: true, // true for 465, false for 587
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

export const sendEmail = async (
  to: string,
  subject: string,
  html: string,
) => {
  try {
    const info = await transporter.sendMail({
      from: `"Lekota" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });

    console.log("Email sent:", info.messageId);
  } catch (error: any) {
    console.error("Email failed:", error.message);
    throw error;
  }
};
