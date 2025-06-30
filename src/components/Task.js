import React from 'react';
import './Task.css'; // Import your custom styles

const Task = () => {
  const userId = localStorage.getItem('user_id') || 'guest';
  const offerwallUrl = `https://timewall.io/users/login?oid=586482e6e7512000&uid=${userId}&tab=tasks`;

  return (
    <div className="task-container">
      <h2 className="task-header">💰 Complete Tasks & Earn Real Rewards!</h2>
      <iframe
        title="TimeWall Tasks"
        src={offerwallUrl}
        className="task-iframe"
        scrolling="auto"
      />
    </div>
  );
};

export default Task;