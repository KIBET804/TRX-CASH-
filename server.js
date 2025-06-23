// server.js

const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// Get Access Token
const getAccessToken = async () => {
  const auth = Buffer.from(`${process.env.CONSUMER_KEY}:${process.env.CONSUMER_SECRET}`).toString('base64');
  const response = await axios.get(
    `${process.env.BASE_URL}/oauth/v1/generate?grant_type=client_credentials`,
    {
      headers: {
        Authorization: `Basic ${auth}`
      }
    }
  );
  return response.data.access_token;
};

// STK Push Route
app.post('/mpesa/stkpush', async (req, res) => {
  const { phone, amount } = req.body;

  const timestamp = new Date()
    .toISOString()
    .replace(/[-:TZ.]/g, '')
    .slice(0, 14);

  const password = Buffer.from(
    `${process.env.SHORTCODE}${process.env.PASSKEY}${timestamp}`
  ).toString('base64');

  const token = await getAccessToken();

  try {
    const response = await axios.post(
      `${process.env.BASE_URL}/mpesa/stkpush/v1/processrequest`,
      {
        BusinessShortCode: process.env.SHORTCODE,
        Password: password,
        Timestamp: timestamp,
        TransactionType: "CustomerPayBillOnline",
        Amount: amount,
        PartyA: phone,
        PartyB: process.env.SHORTCODE,
        PhoneNumber: phone,
        CallBackURL: process.env.CALLBACK_URL,
        AccountReference: "TRX",
        TransactionDesc: "TRX task payment"
      },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    res.json({ message: 'STK Push initiated', data: response.data });
  } catch (error) {
    console.error('Error initiating STK Push:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to initiate STK Push' });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});