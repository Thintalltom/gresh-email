import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  try {
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Content-Type');

    if (req.method === 'OPTIONS') {
      return res.status(200).end();
    }

    if (req.method === 'POST') {
      const { email, orderSummary } = req.body;

      if (!email || !Array.isArray(orderSummary)) {
        return res.status(400).json({ error: 'Invalid request payload' });
      }

      const orderDetails = orderSummary
      .map(item => `
        <div style="
          border: 1px solid #ddd;
          border-radius: 8px;
          padding: 15px;
          margin-bottom: 15px;
          display: flex;
          align-items: center;
          background-color: #f9f9f9;
          box-shadow: 0 2px 4px rgba(0,0,0,0.05);
        ">
           
               style="width: 80px; height: 80px; object-fit: cover; border-radius: 5px; margin-right: 15px;" />
          <div style="flex: 1;">
            <p style="margin: 0; font-size: 16px; font-weight: bold; color: #333;">${item.name}</p>
            <p style="margin: 5px 0 0; font-size: 14px; color: #555;">
              Email: <span style="color: #000;">${item.email}</span><br>
             
            </p>
          </div>
        </div>
      `).join('');
      

      const htmlContent = `
        <h1>Waitlist recieved!</h1>
        <p>Here are the Client details:</p>
        ${orderDetails}
        <p>Best regards,<br>Gresh Finance</p>
      `;

      // Use correct Gmail transport config
      const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        auth: {
          user: process.env.EMAIL,
          pass: process.env.PASSWORD,
        },
      });

      const mailOptions = {
        from: process.env.EMAIL,
        to: process.env.EMAIL,
        subject: 'Waitlist Recieved!',
        html: htmlContent,
      };

      await transporter.sendMail(mailOptions);
      return res.status(200).json({ message: 'Email sent successfully!' });
    }

    res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('[Email API Error]', error);
    res.status(500).json({ error: 'Internal server error while processing email.' });
  }
}