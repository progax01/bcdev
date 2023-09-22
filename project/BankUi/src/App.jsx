// App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import MetaMaskSignIn from './MetaMaskSignIn';
import Dashboard from './section/Dashboard';
import "./index.css";
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MetaMaskSignIn />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
