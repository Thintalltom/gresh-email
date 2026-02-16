import nodemailer from "nodemailer";

export default async function handler(req, res) {
  try {
    res.setHeader("Access-Control-Allow-Credentials", true);
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET,OPTIONS,PATCH,DELETE,POST,PUT",
    );
    res.setHeader(
      "Access-Control-Allow-Headers",
      "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version",
    );

    if (req.method === "OPTIONS") {
      return res.status(200).end();
    }

    if (req.method === "POST") {
      const { email } = req.body;

      if (!email) {
        return res.status(400).json({ error: "Email is required" });
      }

      const acknowledgmentOptions = `
  <h2>Thank You!</h2>
  <p>This email serves as a notification that we have received your request to join the waitlist at GreshFinance.</p>
  <p>We will get back to you as soon as possible.</p>
  <p>Best regards,<br>GreshFinance</p>
`;

      const htmlContent = `
  <h1>We Received Your Message To Join waitlist at GreshFinance</h1>
  ${acknowledgmentOptions}
`;

      // Use correct Gmail transport config
      const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        auth: {
          user: process.env.EMAIL,
          pass: process.env.PASSWORD,
        },
      });

      const mailOptions = {
        from: process.env.EMAIL,
        to: email,
        subject: "Acknowledgment Email from GreshFinance",
        html: htmlContent,
      };

      await transporter.sendMail(mailOptions);
      return res.status(200).json({ message: "Email sent successfully!" });
    }

    res.status(405).json({ error: "Method not allowed" });
  } catch (error) {
    console.error("[Email API Error]", error);
    res
      .status(500)
      .json({ error: "Internal server error while processing email." });
  }
}
