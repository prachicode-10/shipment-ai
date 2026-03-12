import express from 'express';
import nodemailer from 'nodemailer';
import cors from 'cors';
import bodyParser from 'body-parser';

const app = express();
const port = 5000;

app.use(cors());
app.use(bodyParser.json());

// Gmail credentials from prachicode-10/otp repo
const sender_email = "prachisharma5232@gmail.com";
const app_password = "qnzfpocpuugiadxv";

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: sender_email,
        pass: app_password
    }
});

app.post('/api/send-otp', (req, res) => {
    console.log('[DEBUG] Incoming request body:', req.body);
    const rawEmail = req.body && req.body.email;
    if (!rawEmail) {
        return res.status(400).json({ error: 'Email is required' });
    }

    const email = rawEmail.trim().toLowerCase();
    console.log(`[AUTH] Target recipient: "${email}"`);
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    console.log(`[AUTH] Access Code: ${otp}`);

    const mailOptions = {
        from: sender_email,
        to: email,
        subject: 'Your Access Code - ShipmentGuard AI',
        text: `Your OTP is ${otp}\nIt will expire in 60 seconds.\n\nSecurity Team,\nShipmentGuard AI`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('[ERROR] Email failed:', error);
            return res.status(500).json({ error: 'Failed to send OTP' });
        }
        console.log(`[SUCCESS] Email sent to: ${email}`);
        res.json({ message: 'OTP sent successfully', otp }); // In a real app, don't return the OTP to the client
    });
});

app.listen(port, '0.0.0.0', () => {
    console.log(`OTP Server running at http://127.0.0.1:${port}`);
});
