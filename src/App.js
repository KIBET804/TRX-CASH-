// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Task from './components/Task';
import Highlights from './components/Highlights';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/task" element={<Task />} />
        <Route path="/highlights" element={<Highlights />} />
      </Routes>
    </Router>
  );
}

export default App;