import { Resend } from "resend";
import dotenv from "dotenv";
dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY!);

export const sendEmail = async (to: string, subject: string, html: string) => {
  try {
    const response = await resend.emails.send({
      from: "Lekota <blessedlyrics11@omegavisionchristiannetwork.com>", // can be any verified email in Resend
      to,
      subject,
      html,
    });
    
    return response;
  } catch (error: any) {
    console.error("Email failed:", error.message);
    throw error;
  }
};