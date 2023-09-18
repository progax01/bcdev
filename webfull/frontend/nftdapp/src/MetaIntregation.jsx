import { useState, useEffect } from 'react';
import Web3 from 'web3';
import { isMetaMaskInstalled } from 'react-web3';

const MetaIntegration = () => {
  const [account, setAccount] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchMetaMaskAccount() {
      if (!isMetaMaskInstalled()) {
        setError('MetaMask is not installed');
        return;
      }

      const web3 = new Web3(window.ethereum);

      try {
        // Request access to MetaMask account
        await window.ethereum.request({ method: 'eth_requestAccounts' });

        // Get the user's Ethereum address
        const accounts = await web3.eth.getAccounts();
        setAccount(accounts[0]);
      } catch (err) {
        console.error(err);
        setError('Failed to connect to MetaMask');
      }
    }

    fetchMetaMaskAccount();
  }, []);

  return (
    <div>
      {error ? (
        <p>Error: {error}</p>
      ) : (
        <p>Connected MetaMask Account: {account}</p>
      )}
    </div>
  );
};

export default MetaIntegration;
