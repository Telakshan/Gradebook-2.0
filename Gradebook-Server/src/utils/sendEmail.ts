import nodemailer from "nodemailer";

export async function sendEmail(to: string, html: string) {

 
  await nodemailer.createTestAccount();

  let transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false,
    auth: {
      user: 'pfqvly3kxsb2hevs@ethereal.email', 
      pass: 'zVQmAtW5hbu72uWwDf', 
  }
});

  let info = await transporter.sendMail({
    from: '"Fred Foo 👻" <foo@example.com>', 
    to: to, 
    subject: "Forgot Password Request",
    html: html
  });

   console.log("Message sent: %s", info.messageId);

  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
}

