/** @type import('hardhat/config').HardhatUserConfig */
require("dotenv").config()
require("@nomiclabs/hardhat-waffle");
//require("@nomicfoundation/hardhat-toolbox");
require("@nomiclabs/hardhat-ethers");

const API_Url= process.env.API_URL
const Ac_Private_key= process.env.PRIVATE_KEY
const Etherscan_key= process.env.API_KEY

module.exports = {
  defaultNetwork: "sepolia",
  networks: {
    hardhat: {
      // For local development, uses Hardhat's built-in network
    },
    sepolia: {
      url: API_Url, // Your Alchemy API URL
      accounts: [Ac_Private_key], // Your Ethereum account private key
    },
  },
  solidity: {
    version: "0.8.19", // Use the desired Solidity version
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
     
    },
  },
  etherscan: {
    apiKey: Etherscan_key,
  },
};