// src/components/Highlights.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Highlights.css';
import { auth, db } from '../firebase';
import {
  doc,
  getDoc,
  addDoc,
  collection,
  serverTimestamp,
  query,
  where,
  getDocs
} from 'firebase/firestore';

const Highlights = () => {
  const [phone, setPhone] = useState('');
  const [amount, setAmount] = useState('');
  const [status, setStatus] = useState('');
  const [isEligible, setIsEligible] = useState(false);
  const [totalWithdrawn, setTotalWithdrawn] = useState(0);
  const [withdrawals, setWithdrawals] = useState([]);
  const [userData, setUserData] = useState(null);

  const user = auth.currentUser;

  useEffect(() => {
    const fetchEligibilityAndWithdrawals = async () => {
      if (!user) return;

      const userRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userRef);
      const data = userDoc.data();
      setUserData(data);

      const lastTaskDate = data?.lastTaskDate?.toDate?.();

      if (lastTaskDate) {
        const today = new Date();
        const diffTime = today.getTime() - lastTaskDate.getTime();
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        setIsEligible(diffDays >= 4);
      }

      // Get user's withdrawals
      const q = query(
        collection(db, 'withdrawals'),
        where('uid', '==', user.uid)
      );
      const querySnapshot = await getDocs(q);
      const withdrawData = querySnapshot.docs.map(doc => doc.data());
      setWithdrawals(withdrawData);

      const total = withdrawData.reduce((sum, item) => sum + (item.amount || 0), 0);
      setTotalWithdrawn(total);
    };

    fetchEligibilityAndWithdrawals();
  }, [user]);

  const handleWithdraw = async () => {
    if (!phone || !amount) {
      alert("Please enter both phone number and amount");
      return;
    }

    if (!isEligible) {
      alert("You're not eligible for withdrawal yet. Please wait 4 days after completing tasks.");
      return;
    }

    try {
      setStatus('Processing...');
      await axios.post('http://localhost:5000/mpesa/stkpush', {
        phone: `254${phone.replace(/^0+/, '')}`,
        amount: parseInt(amount)
      });

      await addDoc(collection(db, 'withdrawals'), {
        uid: user.uid,
        amount: parseInt(amount),
        phone: `254${phone.replace(/^0+/, '')}`,
        timestamp: serverTimestamp()
      });

      setStatus('STK Push Sent. Check your phone.');
      setAmount('');
      setPhone('');
    } catch (error) {
      console.error(error);
      setStatus('Failed to send STK Push');
    }
  };

  return (
    <div className="highlights-container">
      <div className="leaderboard-box">
        <h2>Withdrawal Info</h2>
        <p><strong>Total Withdrawn:</strong> KES {totalWithdrawn}</p>
        <p><strong>Eligibility:</strong> {isEligible ? '✅ Eligible' : '❌ Not Yet (Wait 4 Days)'}</p>
      </div>

      <div className="withdraw-box">
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
        <button
          onClick={handleWithdraw}
          disabled={!isEligible}
          style={{ backgroundColor: isEligible ? '#f97316' : 'gray' }}
        >
          {isEligible ? 'Withdraw Now' : 'Not Yet Eligible'}
        </button>
        <p>{status}</p>
      </div>

      <div className="leaderboard-box">
        <h3>Your Withdrawal History</h3>
        {withdrawals.length === 0 ? (
          <p>No withdrawals yet.</p>
        ) : (
          <ul>
            {withdrawals.map((w, index) => (
              <li key={index}>
                KES {w.amount} —{' '}
                {w.timestamp?.toDate?.().toLocaleDateString() || 'Pending...'}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* 🔥 User Performance Section */}
      <div className="leaderboard-box">
        <h3>📊 Your Performance</h3>
        {userData ? (
          <table>
            <thead>
              <tr>
                <th>Referrals</th>
                <th>Today</th>
                <th>This Week</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{userData.referrals || 0}</td>
                <td>{userData.todayPoints || 0}</td>
                <td>{userData.weekPoints || 0}</td>
                <td>{userData.totalPoints || 0}</td>
              </tr>
            </tbody>
          </table>
        ) : (
          <p>Loading your performance...</p>
        )}
      </div>
    </div>
  );
};

export default Highlights;