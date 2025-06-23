import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';
import './Dashboard.css'; // For the wheel animation styles

function Dashboard() {
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState('');
  const [currentTime, setCurrentTime] = useState(new Date());
  const navigate = useNavigate();

  const rewards = ['10 Points', '50 Points', 'No Win', '100 Points', 'Try Again', '20 Points'];

  const spinWheel = () => {
    if (spinning) return;
    setSpinning(true);
    setResult('');
    const angle = Math.floor(Math.random() * 360);
    const prizeIndex = Math.floor((angle % 360) / (360 / rewards.length));
    setTimeout(() => {
      setSpinning(false);
      setResult(rewards[prizeIndex]);
    }, 3000);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formattedDate = currentTime.toLocaleDateString('en-US', {
    weekday: 'short',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const formattedTime = currentTime.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="dashboard-container">
      <div className="dashboard-content">
        <h1>Welcome to TRX Dashboard</h1>

        {/* White news banner */}
        <div className="news-banner">
          <p className="news-date">{formattedDate}</p>
          <p className="news-message">📢 Spin now and earn real rewards!</p>
          <p className="news-time">{formattedTime}</p>
        </div>

        {/* Spinning Wheel */}
        <div className="wheel-container">
          <div className={`wheel ${spinning ? 'spinning' : ''}`}></div>
          <button onClick={spinWheel} disabled={spinning}>
            {spinning ? 'Spinning...' : 'Spin the Wheel'}
          </button>
          {result && <p className="result">🎉 {result} 🎉</p>}
        </div>
      </div>

      <nav className="bottom-nav">
        <div className="nav-item active">
          <span className="icon">🏠</span>
          <span className="label">Home</span>
        </div>
        <div className="nav-item" onClick={() => navigate('/task')}>
          <span className="icon">✅</span>
          <span className="label">Task</span>
        </div>
        <div className="nav-item" onClick={() => navigate('/highlights')}>
          <span className="icon">✨</span>
          <span className="label">Highlights</span>
        </div>
      </nav>
    </div>
  );
}

export default Dashboard;