import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT),
  secure: false, // true for port 465, false for 587
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Example: sending test email
async function sendTestEmail() {
  await transporter.sendMail({
    from: `"E-commerce App" <${process.env.EMAIL_USER}>`,
    to: "someone@example.com",
    subject: "Test Email",
    text: "This is a test email from your Node.js app!",
  });
}

sendTestEmail().catch(console.error);
