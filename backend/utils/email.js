// backend/utils/email.js
// Dummy email sender for password reset (replace with nodemailer in production)
module.exports = async function sendEmail(to, subject, text) {
  console.log(`Sending email to ${to}: ${subject}\n${text}`);
  // In production, use nodemailer or similar to send real emails
  return true;
};
