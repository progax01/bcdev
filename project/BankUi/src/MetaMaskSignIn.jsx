import { useState, useEffect } from "react";
import Web3 from "web3";
import { useNavigate } from "react-router-dom";
function MetaMaskSignIn() {
  const [web3, setWeb3] = useState(null);
  const [account, setAccount] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function connectMetaMask() {
      if (window.ethereum) {
        try {
          await window.ethereum.request({ method: "eth_requestAccounts" });
          const provider = new Web3(window.ethereum);
          const accounts = await provider.eth.getAccounts();
          setWeb3(provider);
          console.log(web3);
          setAccount(accounts[0]);
        } catch (error) {
          console.error(error);
        }
      } else {
        console.error("MetaMask extension not detected!");
      }
    }

    connectMetaMask();
  }, []);

 
    const handleSignIn = () => {
      // Perform authentication logic here using the user's Ethereum address (account).
      if (account) {
        // Redirect to the dashboard page after successful sign-in.
        navigate("/dashboard");
      }
    };
   

  return (
    <div>
    <h1>Wellcome</h1>
    <h2>MetaMask Sign-In</h2>
    {account ? (
      <div>
        <p>Connected Account: {account}</p>
        <button onClick={handleSignIn}>Enter Site</button>
      </div>
    ) : (
      <p>Connect to MetaMask to sign in.</p>
    )}
  </div>
  );
}

export default MetaMaskSignIn;
