// App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import MetaMaskSignIn from './MetaMaskSignIn';
import Dashboard from './section/Dashboard';
import "./index.css";

import MyForm from './section/MyForm';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MetaMaskSignIn />} />
        <Route path="/dashboard" element={<Dashboard />} />
       
        <Route path="/myform" element={<MyForm/>}/>
      </Routes>
    </Router>
  );
}

export default App;
