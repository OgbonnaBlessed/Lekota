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

export const sendEmail = (to: string, subject: string, html: string) => {
  transporter.sendMail({
    from: `"Lekota" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html,
  });
};
