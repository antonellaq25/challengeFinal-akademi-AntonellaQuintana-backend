const nodemailer = require("nodemailer");

const sendEmail = async (to, subject, html) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"Course Online" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });

    console.log(" Email successfully sent to", to);
  } catch (error) {
    console.error(" Error real al enviar el correo:", error);
    throw new Error("Error sending the email");
  }
};

module.exports = sendEmail;
