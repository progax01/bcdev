// Import necessary components from 'react-router-dom'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import MetaMaskSignIn from './MetaMaskSignIn';
import Dashboard from './section/Dashboard';
import "./index.css";
import MyForm from './section/MyForm';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import ViewKyc from './section/ViewKyc';
import CheckVerification from './section/CheckVerification';

function App() {
  return (
    <Router>
      <ToastContainer/>
      <Routes>
        <Route path="/" element={<MetaMaskSignIn />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/myform" element={<MyForm />} />
        <Route path="/view-kyc" element={<ViewKyc />} />
        <Route path="/check-verification" element={<CheckVerification />} />

      </Routes>
    </Router>
  );
}

export default App;
