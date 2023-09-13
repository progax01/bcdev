

import  { useState, useEffect } from 'react';
import Web3 from 'web3';

function Connectmask() {
  const [web3, setWeb3] = useState(null);

  useEffect(() => {
     async function connectMetaMask(){
      
      if(window.ethereum){
        try{
          const web3Instance = new Web3(window.ethereum);
          await window.ethereum.enable();
          setWeb3(web3Instance);
      
        } catch(error){
          console.error("Error connecting to metamask:",error);
        }
      } else {
        console.error("Metamask not found. pls install it");
      }
    }
    connectMetaMask();
  },[]);
     
   

  return (
    <div>
      {web3 ? (
        <p>Connected to MetaMask!</p>
      ) : (
        <p>MetaMask connection required. Please install and connect.</p>
      )}
    </div>
  );
}

export default Connectmask;
