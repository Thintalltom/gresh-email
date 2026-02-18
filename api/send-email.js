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
  <h2>Hey ${email} 👋</h2>
  <p>You’re officially on the Gresh waitlist.</p>
  <p>With you here, things are already shaping up nicely. Since you’re on the list early, you’ll be among the first to know when we open access.</p>
  <p>Do you also know someone tired of card payment stress? Tell them about us! 🚀</p>
  <p>Stay close. We’re almost there.
Grace from Gresh</p>
`;

      const htmlContent = `
  <h1>You’re In!🎉🎉🎉</h1>
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
        subject: "You’re In!🎉🎉🎉",
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
