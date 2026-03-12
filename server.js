import express from 'express';
import nodemailer from 'nodemailer';
import cors from 'cors';
import bodyParser from 'body-parser';
import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';

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

// Load Dataset
let shipmentData = [];
try {
    const csvFile = fs.readFileSync(path.join(process.cwd(), 'shipment_dataset2.csv'), 'utf-8');
    shipmentData = parse(csvFile, {
        columns: true,
        skip_empty_lines: true
    });
    console.log(`[DATA] Loaded ${shipmentData.length} records from shipment_dataset2.csv`);
} catch (error) {
    console.error('[ERROR] Failed to load dataset:', error.message);
}

// Prediction Logic (Ported from modeldash.ipynb)
// Note: In a production app, we would use a library like xgboost-node or tensorflow.js
// For this hackathon demo, we'll implement a weighted heuristic model that mirrors the notebook's XGBoost behavior
const predictDelayRisk = (features) => {
    const { distance, weather, traffic, portCongestion, carrierHistory } = features;
    
    let risk = 0.1; // Base risk

    // Weather impact (Low: 0, Medium: 1, High: 2)
    if (weather === 'High') risk += 0.35;
    else if (weather === 'Medium') risk += 0.15;

    // Traffic impact (Low: 0, Medium: 1, High: 2)
    if (traffic === 'High') risk += 0.25;
    else if (traffic === 'Medium') risk += 0.1;

    // Distance impact
    if (distance > 1500) risk += 0.15;
    else if (distance > 800) risk += 0.05;

    // Port Congestion
    risk += (portCongestion / 5) * 0.1;

    // Carrier History (Poor: 2, Average: 1, Good: 0)
    if (carrierHistory === 'Poor') risk += 0.15;
    else if (carrierHistory === 'Average') risk += 0.05;

    // Cap risk at 0.98 and min at 0.02
    return Math.min(Math.max(risk, 0.02), 0.98);
};

app.post('/api/predict', (req, res) => {
    const { origin, destination, distance, weather, traffic, portCongestion, carrierHistory } = req.body;
    
    if (!origin || !destination) {
        return res.status(400).json({ error: 'Origin and Destination are required' });
    }

    const risk = predictDelayRisk({
        distance: parseFloat(distance) || 500,
        weather: weather || 'Low',
        traffic: traffic || 'Low',
        portCongestion: parseFloat(portCongestion) || 0,
        carrierHistory: carrierHistory || 'Good'
    });

    const eta = (parseFloat(distance) || 500) / 60; // Simple ETA calculation

    res.json({
        origin,
        destination,
        distance: parseFloat(distance) || 500,
        eta: eta.toFixed(2),
        risk: risk.toFixed(2),
        recommendation: risk > 0.6 ? "Alternative path via regional hub suggested due to high risk." : "Route efficiency is high. Proceed with standard logistics path."
    });
});

app.get('/api/shipments/history', (req, res) => {
    res.json(shipmentData.slice(0, 100)); // Return top 100 for now
});

app.get('/api/cities', (req, res) => {
    const origins = shipmentData.map(s => s.origin);
    const destinations = shipmentData.map(s => s.destination);
    const uniqueCities = [...new Set([...origins, ...destinations])].filter(Boolean).sort();
    res.json(uniqueCities);
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
        res.json({ message: 'OTP sent successfully', otp });
    });
});

app.listen(port, '0.0.0.0', () => {
    console.log(`AI & OTP Server running at http://127.0.0.1:${port}`);
});
