// src/components/Highlights.js
import React, { useState } from 'react';
import axios from 'axios';
import './Highlights.css'; // optional styling

const Highlights = () => {
  const [phone, setPhone] = useState('');
  const [amount, setAmount] = useState('');
  const [status, setStatus] = useState('');

  const handleWithdraw = async () => {
    if (!phone || !amount) {
      alert("Please enter both phone number and amount");
      return;
    }

    try {
      setStatus('Processing...');
      const response = await axios.post('http://localhost:5000/mpesa/stkpush', {
        phone: `254${phone.replace(/^0+/, '')}`, // convert 0712... → 254712...
        amount: parseInt(amount)
      });
      setStatus('STK Push Sent. Check your phone.');
      console.log(response.data);
    } catch (error) {
      console.error(error);
      setStatus('Failed to send STK Push');
    }
  };

  return (
    <div className="highlights-container">
      <div className="top-card">
        <h2>Points Summary</h2>
        <p>Referral Points: 0</p>
        <p>Watched Points: 0</p>
        <p>Spinning Points: 0</p>
        <p>Total Points: 0</p>
      </div>

      <div className="withdraw-section">
        <h3>Withdraw</h3>
        <input
          type="text"
          placeholder="Phone (07xx...)"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <button onClick={handleWithdraw}>Withdraw</button>
        <p>{status}</p>
      </div>

      <div className="company-description">
        <h4>About Our Company</h4>
        <p>
          TRX is a reward-based platform that values your time. Complete simple tasks daily and earn real money directly to your phone.
          We believe in fair earnings and transparency.
        </p>
      </div>
    </div>
  );
};

export default Highlights;