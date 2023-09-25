import React from "react";
import Web3 from "web3";

const getKYCData = async (address) => {
  try {
    const web3 = new Web3(window.ethereum);
    await window.ethereum.enable(); // Prompt the user to connect their wallet
    const contractAddress = "0xf0c8FAf7c853834c5d583359D9fDe1b47481e84b"; // Contract address
    const contractABI = [
      {
        inputs: [
          { internalType: "address", name: "getAddress", type: "address" },
        ],
        name: "getKYCData",
        outputs: [
          { internalType: "address", name: "_userAddress", type: "address" },
          { internalType: "bool", name: "_isVerified", type: "bool" },
          { internalType: "string", name: "_FullName", type: "string" },
          { internalType: "string", name: "_Email", type: "string" },
          { internalType: "uint256", name: "_Phone", type: "uint256" },
          { internalType: "uint256", name: "_Aadhar", type: "uint256" },
          { internalType: "string", name: "_Location", type: "string" },
        ],
        stateMutability: "view",
        type: "function",
      },
    ];

    // Create a contract instance
    const contract = new web3.eth.Contract(contractABI, contractAddress);

    // Call the getKYCData function of the contract to fetch user data
    const userData = await contract.methods.getKYCData(address).call();

    return userData;
  } catch (error) {
    throw error; // Handle errors appropriately in the calling component
  }
};

export default getKYCData;
