
import '../index.css'

import {   useState } from "react";
import Web3 from "web3";

function MetaMaskIntegration() {
  const [web3, setWeb3] = useState(null);
  const [account, setAccount] = useState(null);
  const [balance, setBalance] = useState(null);
  const [tokenContract, setTokenContract] = useState(null);
  const [tokenBalance, setTokenBalance] = useState(null);
  const [recipientAddress, setRecipientAddress] = useState('');
  const [transferAmount, setTransferAmount] = useState('');
  const [transactionHash, setTransactionHash] = useState('');
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


            const tokenContractAddress = "0x4b7A6CA413f95CC81F627DC688673f693181d7Fc"; // Replace with your token contract's address
            const tokenContractAbi = [
              { inputs: [], stateMutability: "nonpayable", type: "constructor" },
              {
                inputs: [
                  { internalType: "address", name: "spender", type: "address" },
                  { internalType: "uint256", name: "currentAllowance", type: "uint256" },
                  { internalType: "uint256", name: "requestedDecrease", type: "uint256" },
                ],
                name: "ERC20FailedDecreaseAllowance",
                type: "error",
              },
              {
                inputs: [
                  { internalType: "address", name: "spender", type: "address" },
                  { internalType: "uint256", name: "allowance", type: "uint256" },
                  { internalType: "uint256", name: "needed", type: "uint256" },
                ],
                name: "ERC20InsufficientAllowance",
                type: "error",
              },
              {
                inputs: [
                  { internalType: "address", name: "sender", type: "address" },
                  { internalType: "uint256", name: "balance", type: "uint256" },
                  { internalType: "uint256", name: "needed", type: "uint256" },
                ],
                name: "ERC20InsufficientBalance",
                type: "error",
              },
              {
                inputs: [{ internalType: "address", name: "approver", type: "address" }],
                name: "ERC20InvalidApprover",
                type: "error",
              },
              {
                inputs: [{ internalType: "address", name: "receiver", type: "address" }],
                name: "ERC20InvalidReceiver",
                type: "error",
              },
              {
                inputs: [{ internalType: "address", name: "sender", type: "address" }],
                name: "ERC20InvalidSender",
                type: "error",
              },
              {
                inputs: [{ internalType: "address", name: "spender", type: "address" }],
                name: "ERC20InvalidSpender",
                type: "error",
              },
              {
                inputs: [{ internalType: "address", name: "owner", type: "address" }],
                name: "OwnableInvalidOwner",
                type: "error",
              },
              {
                inputs: [{ internalType: "address", name: "account", type: "address" }],
                name: "OwnableUnauthorizedAccount",
                type: "error",
              },
              {
                anonymous: false,
                inputs: [
                  {
                    indexed: true,
                    internalType: "address",
                    name: "owner",
                    type: "address",
                  },
                  {
                    indexed: true,
                    internalType: "address",
                    name: "spender",
                    type: "address",
                  },
                  {
                    indexed: false,
                    internalType: "uint256",
                    name: "value",
                    type: "uint256",
                  },
                ],
                name: "Approval",
                type: "event",
              },
              {
                anonymous: false,
                inputs: [
                  {
                    indexed: true,
                    internalType: "address",
                    name: "previousOwner",
                    type: "address",
                  },
                  {
                    indexed: true,
                    internalType: "address",
                    name: "newOwner",
                    type: "address",
                  },
                ],
                name: "OwnershipTransferred",
                type: "event",
              },
              {
                anonymous: false,
                inputs: [
                  { indexed: true, internalType: "address", name: "from", type: "address" },
                  { indexed: true, internalType: "address", name: "to", type: "address" },
                  {
                    indexed: false,
                    internalType: "uint256",
                    name: "value",
                    type: "uint256",
                  },
                ],
                name: "Transfer",
                type: "event",
              },
              {
                inputs: [
                  { internalType: "address", name: "owner", type: "address" },
                  { internalType: "address", name: "spender", type: "address" },
                ],
                name: "allowance",
                outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
                stateMutability: "view",
                type: "function",
              },
              {
                inputs: [
                  { internalType: "address", name: "spender", type: "address" },
                  { internalType: "uint256", name: "value", type: "uint256" },
                ],
                name: "approve",
                outputs: [{ internalType: "bool", name: "", type: "bool" }],
                stateMutability: "nonpayable",
                type: "function",
              },
              {
                inputs: [{ internalType: "address", name: "account", type: "address" }],
                name: "balanceOf",
                outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
                stateMutability: "view",
                type: "function",
              },
              {
                inputs: [{ internalType: "uint256", name: "amount", type: "uint256" }],
                name: "burn",
                outputs: [],
                stateMutability: "nonpayable",
                type: "function",
              },
              {
                inputs: [],
                name: "decimals",
                outputs: [{ internalType: "uint8", name: "", type: "uint8" }],
                stateMutability: "view",
                type: "function",
              },
              {
                inputs: [
                  { internalType: "address", name: "spender", type: "address" },
                  { internalType: "uint256", name: "requestedDecrease", type: "uint256" },
                ],
                name: "decreaseAllowance",
                outputs: [{ internalType: "bool", name: "", type: "bool" }],
                stateMutability: "nonpayable",
                type: "function",
              },
              {
                inputs: [
                  { internalType: "address", name: "spender", type: "address" },
                  { internalType: "uint256", name: "addedValue", type: "uint256" },
                ],
                name: "increaseAllowance",
                outputs: [{ internalType: "bool", name: "", type: "bool" }],
                stateMutability: "nonpayable",
                type: "function",
              },
              {
                inputs: [
                  { internalType: "address", name: "account", type: "address" },
                  { internalType: "uint256", name: "amount", type: "uint256" },
                ],
                name: "mint",
                outputs: [],
                stateMutability: "nonpayable",
                type: "function",
              },
              {
                inputs: [],
                name: "name",
                outputs: [{ internalType: "string", name: "", type: "string" }],
                stateMutability: "view",
                type: "function",
              },
              {
                inputs: [],
                name: "owner",
                outputs: [{ internalType: "address", name: "", type: "address" }],
                stateMutability: "view",
                type: "function",
              },
              {
                inputs: [],
                name: "renounceOwnership",
                outputs: [],
                stateMutability: "nonpayable",
                type: "function",
              },
              {
                inputs: [],
                name: "symbol",
                outputs: [{ internalType: "string", name: "", type: "string" }],
                stateMutability: "view",
                type: "function",
              },
              {
                inputs: [],
                name: "totalSupply",
                outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
                stateMutability: "view",
                type: "function",
              },
              {
                inputs: [
                  { internalType: "address", name: "to", type: "address" },
                  { internalType: "uint256", name: "value", type: "uint256" },
                ],
                name: "transfer",
                outputs: [{ internalType: "bool", name: "", type: "bool" }],
                stateMutability: "nonpayable",
                type: "function",
              },
              {
                inputs: [
                  { internalType: "address", name: "from", type: "address" },
                  { internalType: "address", name: "to", type: "address" },
                  { internalType: "uint256", name: "value", type: "uint256" },
                ],
                name: "transferFrom",
                outputs: [{ internalType: "bool", name: "", type: "bool" }],
                stateMutability: "nonpayable",
                type: "function",
              },
              {
                inputs: [{ internalType: "address", name: "newOwner", type: "address" }],
                name: "transferOwnership",
                outputs: [],
                stateMutability: "nonpayable",
                type: "function",
              },
            ]; // Replace with your token contract's ABI
          const tokenContractInstance = new web3Instance.eth.Contract(tokenContractAbi, tokenContractAddress);
          setTokenContract(tokenContractInstance);
          console.log(tokenContractInstance);
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


  const fetchTokenBalance = async () => {
    if (tokenContract && account) {
      const tokenBalance = await tokenContract.methods.balanceOf(account).call();
      setTokenBalance(web3.utils.fromWei(tokenBalance, 'ether'));
      console.log(tokenBalance);
    }
  };

  
  
  const handleTransferTokens = async () => {
    fetchTokenBalance();
    if (!recipientAddress || !transferAmount) {
      console.error('Recipient address and transfer amount are required.');
      return;
    }
  
  
      try {
        const amountInWei = web3.utils.toWei(transferAmount, 'ether'); // Convert to Wei
  
        const transaction = await tokenContract.methods
          .transfer(recipientAddress, amountInWei)
          .send({ from: account });
  
        setTransactionHash(transaction.transactionHash);
      } catch (error) {
        console.error('Error transferring tokens:', error);
      }
    };

  // const handleContract = async()=>{
  

  // };

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
     <button >Connect Contract</button>
     </div>
     <div className="gap-2">
     <h2>Transfer Tokens</h2>
     <div>
       <label>Recipient Address:</label>
       <input
         type="text"
         className='text-black'
         value={recipientAddress}
         onChange={(e) => setRecipientAddress(e.target.value)}
       />
     </div>
     <div>
       <label>Transfer Amount:</label>
       <input
         type="text"
         className='text-black'
         value={transferAmount}
         onChange={(e) => setTransferAmount(e.target.value)}
       />
     </div>
     <button onClick={handleTransferTokens}>Transfer Tokens</button>
     {transactionHash && (
       <div>
         <p>Transaction Hash: {transactionHash}</p>
       </div>
     )}
   </div>
 </div>
     
  );
}

export default MetaMaskIntegration;
