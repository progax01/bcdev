// TokenInfo.js
import  { useState, useEffect } from 'react';
import axios from 'axios';

function TokenInfo() {
  const [name, setName] = useState('');
  const [symbol, setSymbol] = useState('');
  const [owner, setOwner] = useState('');
 
 // const [address, setAddress] = useState('');
  const [mintAddress, setMintAddress] = useState('');
  const [mintURI, setMintURI] = useState('');

  const apiUrl = 'http://localhost:5000'; // Replace with your backend API URL

  // Function to fetch token information
  const getTokenInfo = async () => {
    try {
      const responseName = await axios.post(`${apiUrl}/getName`);
      const responseSymbol = await axios.post(`${apiUrl}/getSymbol`);
      const responseOwner = await axios.post(`${apiUrl}/ContractOwner`);
     // const responseBalance = await axios.post(`${apiUrl}/getBalance`);
   

      setName(responseName.data.name);
      setSymbol(responseSymbol.data.symbol);
      setOwner(responseOwner.data.owner);
   // setBalance(responseBalance.data.bal);
    } catch (error) {
      console.error(error);
    }
  };

  // Function to mint a new token
  const mintToken = async () => {
    try {
      const response = await axios.post(`${apiUrl}/mint`, {
        address: mintAddress,
        uri: mintURI,
      });

      if (response.data.flag) {
        alert(`Token minted successfully! Tx Hash: ${response.data.message}`);
      } else {
        alert('Token minting failed.');
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getTokenInfo();
  }, []);

  return (
    <div>
      <h1>Token Information</h1>
      <div>
        <p>Name: {name}</p>
        <p>Symbol: {symbol}</p>
        <p>Contract Owner: {owner}</p>
   
      </div>

      <h2>Mint a New Token</h2>
      <div>
        <input
          type="text"
          placeholder="Recipient Address"
          value={mintAddress}
          onChange={(e) => setMintAddress(e.target.value)}
        />
        <input
          type="text"
          placeholder="Token URI"
          value={mintURI}
          onChange={(e) => setMintURI(e.target.value)}
        />
        <button onClick={mintToken}>Mint Token</button>
      </div>
    </div>
  );
}

export default TokenInfo;
