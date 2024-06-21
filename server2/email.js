const nodemailer = require("nodemailer");
require("dotenv").config();

async function sendEmail(receiver, subject, text) {
  // Create a transporter object
  let transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  });

  // Define the email options
  let mailOptions = {
    from: "dangdatcao2002@gmail.com",
    to: receiver,
    subject: subject,
    text: text,
  };

  try {
    // Send the email
    let info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", info.messageId);
  } catch (error) {
    console.error("Error sending email:", error);
  }
}

async function sendAlertBudgetEmail(
  receiver,
  budget,
  currentBills,
  currentCost,
  projectName,
  projectId
) {
  // Create a transporter object
  let transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  });
  var currentBillText = "CLOUD APPLICATION\t\t COST (USD)\n";
  currentBillText += currentBills
    .map((bill) => {
      return `  - ${bill._id}\t\t${bill.totalCostUSD}`;
    })
    .join("\n");
  const content = `PROJECT: ${projectName}\nYour budget is $${budget}. \nYour current cost is $${currentCost}. \n\n Your detailed Bill here\n ${currentBillText}  \n\n Please check your usage here: http://localhost:5173/project/${projectId}`;

  // Define the email options
  let mailOptions = {
    from: "dangdatcao2002@gmail.com",
    to: receiver,
    subject: "Alert MultiCloud Budget",
    text: content,
  };

  try {
    // Send the email
    let info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", info.messageId);
  } catch (error) {
    console.error("Error sending email:", error);
  }
}

module.exports = { sendEmail, sendAlertBudgetEmail };
