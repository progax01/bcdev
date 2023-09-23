// ContractInteraction.js

import Web3 from 'web3';

const ContractConnect = async (formData) => {
  try {
    const web3 = new Web3(window.ethereum);
    await window.ethereum.enable(); // Prompt the user to connect their wallet
    const accounts = await web3.eth.getAccounts();
    console.log("**",accounts);
    const contractAddress = '0xf0c8FAf7c853834c5d583359D9fDe1b47481e84b'; //  contract address
    const contractABI =[{"inputs":[{"internalType":"address","name":"getAddress","type":"address"}],"name":"getKYCData","outputs":[{"internalType":"address","name":"_userAddress","type":"address"},{"internalType":"bool","name":"_isVerified","type":"bool"},{"internalType":"string","name":"_FullName","type":"string"},{"internalType":"string","name":"_Email","type":"string"},{"internalType":"uint256","name":"_Phone","type":"uint256"},{"internalType":"uint256","name":"_Aadhar","type":"uint256"},{"internalType":"string","name":"_Location","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"userAds","type":"address"},{"internalType":"string","name":"FullName","type":"string"},{"internalType":"string","name":"Email","type":"string"},{"internalType":"uint256","name":"Phone","type":"uint256"},{"internalType":"uint256","name":"Aadhar","type":"uint256"},{"internalType":"string","name":"Location","type":"string"}],"name":"setKYCData","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"verifyAddress","type":"address"}],"name":"verifyKYC","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"}];
    // Create a contract instance
    const contract = new web3.eth.Contract(contractABI, contractAddress);

console.log(contract);
    // Sending the data to the smart contract
    const result ={
        from:accounts[0],
        to: contractAddress,
        gas:500000,
        data: contract.methods.setKYCData(
        accounts[0],
        formData.fullName,
        formData.email,
        formData.phoneNumber,
      formData.aadharNumber,
      formData.location
     ).encodeABI(),
  };
    
  const newHash= await web3.eth.sendTransaction(result);



    return (newHash.transactionHash.toString()); // Return the transaction hash
  } catch (error) {
    if (error.message.includes('KYC already Done use')) {
        throw new Error('Address used');
      } else {
        throw error; // Re-throw the original error for other unexpected errors
      }// Rethrow the error for handling in the form component
  }
};

export default ContractConnect;
