import { useState, useEffect } from 'react'
import AppAuthenticated from "./components/AppAuthenticated"
const Web3 = require("web3");

const App = () => {
  const [walletConnected, setWalletConnected] = useState(false);
  const [instruction, setInstruction] = useState("Waiting for connection with wallet...");
  
  useEffect(() => {
    const connectWallet = async () => {
      if(!window.ethereum)
        return;

      try {
        await window.ethereum.request({method:'eth_requestAccounts'})
        setInstruction("Connected");
        setWalletConnected(true);
       
        window.web3 = new Web3(window.ethereum);
      } catch (error) {
        setInstruction("Wallet connection denied, reload the page to try again.");
        return;
      }
     

    };
    connectWallet();
  }, []);

  return (
    <div>
      {window.ethereum ?
        (walletConnected ?
          <AppAuthenticated/>
          : instruction)
        : "Metamask wallet not found pls install."
      }
    </div>
  )
}

export default App
