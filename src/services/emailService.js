const nodemailer = require('nodemailer');

async function createTransporter() {
  let user = process.env.ETHEREAL_USER;
  let pass = process.env.ETHEREAL_PASS;

  if (!user || !pass) {
    const testAccount = await nodemailer.createTestAccount();
    user = testAccount.user;
    pass = testAccount.pass;
    console.log('Ethereal test account created; preview URL available for messages.');
  }

  const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: { user, pass }
  });

  return transporter;
}

async function sendEmailWithAttachment({ to, subject, text, html, attachments = [] }) {
  const transporter = await createTransporter();
  const info = await transporter.sendMail({
    from: `"No Reply" <no-reply@example.com>`,
    to,
    subject,
    text,
    html,
    attachments
  });

  if (nodemailer.getTestMessageUrl) {
    const preview = nodemailer.getTestMessageUrl(info);
    if (preview) console.log('Preview URL:', preview);
  }

  return info.messageId ? true : false;
}

module.exports = { sendEmailWithAttachment };
