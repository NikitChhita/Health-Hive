import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS, // use an app password, not real real password
  },
});

export const sendResetEmail = async (toEmail, resetUrl) => {
  await transporter.sendMail({
    from: `"Health Hive" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: 'Reset your password',
    html: `
      <p>You requested a password reset.</p>
      <p>Click the link below — it expires in 1 hour:</p>
      <a href="${resetUrl}">${resetUrl}</a>
      <p>If you didn't request this, ignore this email.</p>
    `,
  });
};