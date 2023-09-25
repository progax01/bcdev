import { useState, useEffect } from "react";
import Web3 from "web3";
import { useNavigate } from "react-router-dom";
import "./index.css";
import Myvdo from "./assets/videoplayback.mp4";

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
    <div className= " overlay">
    <video src={Myvdo} autoPlay loop muted playbackrate={2}/>
    <div className="content">
    <h1>Wellcome</h1>
    <h2 className="gap-[5] p-5 text-lg ">MetaMask Sign-In Required</h2>
    {account ? (
      <div>
        <p className="text-lg text-bold">Connected Account: {account}</p>
        <button className="gap-5 p-2 mt-5 bg-[#73acbc] text-black" onClick={handleSignIn}>Enter Site</button>
      </div>
    ) : (
      <p className="gap-5 text-red">Install and Connect to MetaMask to Enter Site.</p>
    )}
    </div>
  </div>
  );
}

export default MetaMaskSignIn;
