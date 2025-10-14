const nodemailer = require('nodemailer');
const dotenv = require('dotenv');

dotenv.config();

const transporter = nodemailer.createTransport({
  service: process.env.MAIL_HOST,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

const sendMail = async (to, title, body) => {
  const htmlTemplate = `
  <!DOCTYPE html>
  <html lang="pt-BR">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${title}</title>
    <style>
      body {
        margin: 0;
        padding: 0;
        background-color: #f3f4f6;
        font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      }
      .container {
        max-width: 600px;
        margin: 30px auto;
        background: #ffffff;
        border-radius: 12px;
        overflow: hidden;
        box-shadow: 0 4px 10px rgba(0,0,0,0.08);
      }
      .header {
        background: linear-gradient(135deg, #0046b0ff, #7a3dc9ff);
        color: white;
        text-align: center;
        padding: 25px 20px;
      }
      .header h1 {
        margin: 0;
        font-size: 24px;
      }
      .body {
        padding: 30px 25px;
        color: #333;
        line-height: 1.6;
        font-size: 16px;
      }
      .body h2 {
        color: #0029b0ff;
        font-size: 20px;
        margin-bottom: 15px;
      }
      .footer {
        background-color: #f9fafb;
        text-align: center;
        padding: 15px;
        font-size: 13px;
        color: #666;
      }
      .button {
        display: inline-block;
        margin-top: 20px;
        background-color: #3500b0ff;
        color: white;
        text-decoration: none;
        padding: 10px 20px;
        border-radius: 6px;
        transition: background 0.3s ease;
      }
      .button:hover {
        background-color: #512da3ff;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1>Fit ++</h1>
      </div>
      <div class="body">
        <h2>${title}</h2>
        <p>${body}</p>
      </div>
      <div class="footer">
        © ${new Date().getFullYear()} Fit ++ — Todos os direitos reservados.<br>
        Este é um e-mail automático, por favor não responda.
      </div>
    </div>
  </body>
  </html>
  `;

  const mailOptions = {
    from: process.env.MAIL_USER,
    to,
    subject: title,
    html: htmlTemplate,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("✅ Email enviado com sucesso");
  } catch (error) {
    console.error("❌ Erro ao enviar email:", error);
    throw error;
  }
};


module.exports = { sendMail };