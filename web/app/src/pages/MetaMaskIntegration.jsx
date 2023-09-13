// src/components/MetaMaskIntegration.js
import '../index.css'

import {   useState } from "react";
import Web3 from "web3";

function MetaMaskIntegration() {
  const [web3, setWeb3] = useState(null);
  const [account, setAccount] = useState(null);
  const [balance, setBalance] = useState(null);

  //useEffect(() => {
  // async function connectMetaMask() {
  //   if (window.ethereum) {
  //     try {
  //       const web3Instance = new Web3(window.ethereum);
  //       await window.ethereum.enable();
  //       setWeb3(web3Instance);

  //       // Get the connected account
  //       const accounts = await web3Instance.eth.getAccounts();
  //       const connectedAccount = accounts[0];
  //       setAccount(connectedAccount);

  //       // Get the account balance
  //       const accountBalance = await web3Instance.eth.getBalance(connectedAccount);
  //       setBalance(web3Instance.utils.fromWei(accountBalance, 'ether'));
  //     } catch (error) {
  //       console.error('Error connecting to MetaMask:', error);
  //     }
  //   } else {
  //     console.error('MetaMask not found. Please install it.');
  //   }
  // }

  //   connectMetaMask();
  // }, []);

  const handleConnectWalletClick = async () => {
    try {
      if (window.ethereum) {
        try {
          const web3Instance = new Web3(window.ethereum);
          await window.ethereum.enable();
          setWeb3(web3Instance);

          // Get the connected account
          const accounts = await web3Instance.eth.getAccounts();
          const connectedAccount = accounts[0];
          setAccount(connectedAccount);

          // Get the account balance
          const accountBalance = await web3Instance.eth.getBalance(
            connectedAccount
          );
          setBalance(web3Instance.utils.fromWei(accountBalance, "ether"));
        } catch (error) {
          console.error("Error connecting to MetaMask:", error);
        }
      } else {
        console.error("MetaMask not found. Please install it.");
      }
    } catch (error) {
      console.error("Error connecting to MetaMask:", error);
    }
  };

  const handleDisplayBalanceClick = async () => {
    if (web3 && account) {
      // Get the account balance
      const accountBalance = await web3.eth.getBalance(account);
      setBalance(web3.utils.fromWei(accountBalance, "ether"));
    }
    <p>Balance: {balance} ETH</p>
  };

  const handleContract = async()=>{
    ContractCon();

  };

  return (
    <div>
      <div>
        {account ? (
          <div>
            <p>Connected Account: {account}</p>
          
            <button onClick={handleDisplayBalanceClick}>Display Balance</button>

            <p>Balance: {balance} ETH</p> 
          </div>
        
        ) : (
          <div>
            <p>No account connected.</p>
            <button onClick={handleConnectWalletClick}>Connect Wallet</button>
          </div>
        )}
      </div>
     <div className="gap-2 ">
     <button onClick={handleContract}>Connect Contract</button>
     </div>
      
    </div>
  );
}

export default MetaMaskIntegration;
