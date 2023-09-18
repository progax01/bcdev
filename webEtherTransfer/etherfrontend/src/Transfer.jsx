import { useState } from 'react';
import { useFormik } from 'formik';
import axios from 'axios';

const Transfer = () => {
  const [transactionHash, setTransactionHash] = useState('');
  const [statusMessage, setStatusMessage] = useState('');
  const initialValues = {
    toAddress: '',
    amount: '',
  };

  const onSubmit = async (values) => {
    try {
      setStatusMessage('Initiating Ether transfer...');
      const response = await axios.post('/transfer', values);
      setTransactionHash(response.data.transactionHash);
      setStatusMessage('Ether transfer successful!');
    } catch (error) {
      console.error(error);
      setStatusMessage('Error: Ether transfer failed');
    }
  };

  const formik = useFormik({
    initialValues,
    onSubmit,
  });

  return (
    <div>
      <h2>Ether Transfer Form</h2>
      <form onSubmit={formik.handleSubmit}>
        <div>
          <label htmlFor="toAddress">To Address</label>
          <input
            type="text"
            id="toAddress"
            placeholder='0X receiver address'
            name="toAddress"
            onChange={formik.handleChange}
            value={formik.values.toAddress}
          />
        </div>
        <div>
          <label htmlFor="amount">Amount</label>
          <input
            type="text"
            id="amount"
            placeholder='Enter in wei'
            name="amount"
            onChange={formik.handleChange}
            value={formik.values.amount}
          />
        </div>
        <button type="submit">Transfer Ether</button>
      </form>
      {statusMessage && (
        <div>
          <p>Status: {statusMessage}</p>
        </div>
      )}
      {transactionHash && (
        <div>
          <p>Transaction Hash: {transactionHash}</p>
        </div>
      )}
    </div>
  );
};

export default Transfer;
