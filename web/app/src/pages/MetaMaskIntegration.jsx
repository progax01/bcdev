import "../index.css";

import { useState } from "react";
import Web3 from "web3";

function MetaMaskIntegration() {
  const [web3, setWeb3] = useState(null);
  //const provider = new Web3HttpProvider('https://sepolia.infura.io/v3/da8932a090e84bc8ac665b643d5bf539');
  const [account, setAccount] = useState(null);
  const [balance, setBalance] = useState(null);
  const [tokenContract, setTokenContract] = useState(null);
  const [tokenBalance, setTokenBalance] = useState("");
  const [recipientAddress, setRecipientAddress] = useState("");
  // const [transError, set transError]= useState("Transaction not started");
  const [transactionStatus, setTransactionStatus] =
    useState("transaction status");
  const [transferAmount, setTransferAmount] = useState("");

  const [transactionHash, setTransactionHash] = useState("");
  const [mintAmount, setmintAmount] = useState("");
  const [mintAddress, setmintAddress] = useState("");
  const [minthash, setminthash] = useState("");

  const tokenContractAddress = "0x4b7A6CA413f95CC81F627DC688673f693181d7Fc"; // Replace with your token contract's address
  const tokenContractAbi = [
    { inputs: [], stateMutability: "nonpayable", type: "constructor" },
    {
      inputs: [
        { internalType: "address", name: "spender", type: "address" },
        {
          internalType: "uint256",
          name: "currentAllowance",
          type: "uint256",
        },
        {
          internalType: "uint256",
          name: "requestedDecrease",
          type: "uint256",
        },
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
        {
          indexed: true,
          internalType: "address",
          name: "from",
          type: "address",
        },
        {
          indexed: true,
          internalType: "address",
          name: "to",
          type: "address",
        },
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
        {
          internalType: "uint256",
          name: "requestedDecrease",
          type: "uint256",
        },
      ],
      name: "decreaseAllowance",
      outputs: [{ internalType: "bool", name: "", type: "bool" }],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        { internalType: "address", name: "spender", type: "address" },
        {
          internalType: "uint256",
          name: "addedValue",
          type: "uint256",
        },
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
  ];

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

          // Replace with your token contract's ABI
          const tokenContractInstance = new web3Instance.eth.Contract(
            tokenContractAbi,
            tokenContractAddress
          );
          setTokenContract(tokenContractInstance);
          console.log(tokenContractInstance);
          fetchTokenBalance();
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
    <p>Balance: {balance} ETH</p>;
  };

  const fetchTokenBalance = async () => {
    if (tokenContract && account) {
      const tokenBalance = await tokenContract.methods
        .balanceOf(account)
        .call();
      setTokenBalance(web3.utils.fromWei(tokenBalance, "ether"));
    }
  };

  const handleTransferTokens = async () => {
    fetchTokenBalance();

    if (!recipientAddress || !transferAmount) {
      console.error("Recipient address and transfer amount are required.");
      return;
    }
    console.log("new new");
    try {
      // const web3= new Web3();
      setTransactionStatus("Processing");
      const amountInWei = web3.utils.toWei(transferAmount.toString(), "ether"); // Convert to Wei

      const transferParams = {
        from: account,
        to: tokenContractAddress,

        gas: 500000,
        data: tokenContract.methods
          .transfer(recipientAddress, amountInWei)
          .encodeABI(),
      };

      // const transaction = await tokenContract.methods.transfer(transferParams.to, transferParams.value).send({ from: account[0]});

      setTransactionStatus("Completed");
      const txhash = await web3.eth.sendTransaction(transferParams);
      setTransactionHash(txhash.transactionHash.toString());
    } catch (error) {
      console.error("Error transferring tokensadsf:", error);
      setTransactionStatus("Failed");
    }
  };
  // const transactionObject = {
  //   from: "0x660A21d19c9Fb7b410903b697C0DdD0976E39184",
  //   to: "0x5B9E995108c51457De3F6FDd9D80D71C517e244F",
  //   value: web3.utils.toWei(10, 'ether'),
  //   gas: 21000, // Gas limit
  //   gasPrice: web3.utils.toWei('10', 'gwei'), // Gas price in Gwei
  // };

  // web3.eth.sendTransaction(transactionObject)
  //   .on('transactionHash', function(hash) {
  //     console.log('Transaction hash:', hash);
  //   })
  //   .on('receipt', function(receipt) {
  //     console.log('Transaction receipt:', receipt);

  //     if (receipt.status) {
  //       console.log('Transaction was successful and signed by the user.');
  //     } else {
  //       console.log('Transaction failed or was not signed by the user.');
  //     }
  //   })
  //   .on('error', function(error) {
  //     console.error('Transaction error:', error);
  //   });
  //

  // const handleContract = async()=>{

  // };

  const handleTokenMint = async () => {
  //  const mAmount= web3.utils.fromWei(transferAmount.toString());
    const txobj = {
      from: account,
      to: tokenContractAddress,
      gas: "500000",
      data: tokenContract.methods.mint(mintAddress, mintAmount).encodeABI(),
    };
    const MintHash = await web3.eth.sendTransaction(txobj);
    setminthash(MintHash.transactionHash.toString());
    fetchTokenBalance();
  };

  return (
    <div>
      <div>
        {account ? (
          <div className="flex gap-2 p-5">
            <p>Connected Account: {account}</p>
          </div>
        ) : (
          <div className="flex justify-start gap-4">
            <button onClick={handleConnectWalletClick}>Connect Wallet</button>
            <p>No account connected.</p>
          </div>
        )}
      </div>
      <div className="flex justify-start gap-4">
        <button onClick={fetchTokenBalance}>Connect Contract</button>
        <p>Token Balance is : {tokenBalance}</p>
      </div>
      <div className="side">
        <h2>Transfer Tokens</h2>
        <div className="gap-4">
          <label>Recipient Address:</label>
          <input
            type="text"
            className="text-black"
            value={recipientAddress}
            onChange={(e) => setRecipientAddress(e.target.value)}
          />
        </div>
        <div className="gap-4">
          <label>Transfer Amount:</label>
          <input
            type="text"
            className="text-black"
            value={transferAmount}
            onChange={(e) => setTransferAmount(e.target.value)}
          />
        </div>
      </div>
      <div className="side">
        <button onClick={handleTransferTokens}>Transfer Tokens</button>
        {transactionStatus === "Processing" && (
          <p>Transaction is processing...</p>
        )}
        {transactionStatus === "Completed" && (
          <div>
            <p>Transaction Hash: {transactionHash}</p>
            <p>Transaction completed successfully.</p>
          </div>
        )}
        {transactionStatus === "Failed" && (
          <p>Error transferring tokens. Please try again.</p>
        )}
      </div>
      <div className="side">
        mint function
        <div className="gap-4">
          <label>Mint owner Address:</label>
          <input
            type="text"
            className="text-black"
            value={mintAddress}
            onChange={(e) => setmintAddress(e.target.value)}
          />
        </div>
        <div className=" ">
          <label>Mint Amount:</label>
          <input
            type="text"
            className="text-black"
            value={mintAmount}
            onChange={(e) => setmintAmount(e.target.value)}
          />
        </div>
      </div>
      <div className="side">
        <button onClick={handleTokenMint}>Mint Tokens</button>
        <p>Token balance is: {tokenBalance}</p>
        <p>Trx hash  {minthash}</p>
      </div>
    </div>
  );
}

export default MetaMaskIntegration;
