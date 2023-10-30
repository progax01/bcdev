/**
 * @type import('hardhat/config').HardhatUserConfig
 */
require("@nomiclabs/hardhat-waffle")

// const { task } = require('@nomiclabs/hardhat/config');

// require('hardhat-etherscan');

// task('verify:verify', 'Verifies a contract on Etherscan', async (_, { etherscan }) => {
//   const contractAddress = process.argv[3];
//   const constructorArguments = process.argv.slice(4);

//   // Verify the contract
//   await etherscan.verify({
//     address: contractAddress,
//     constructorArguments,
//   });
// });

module.exports = {
  solidity: "0.8.7",
  defaultNetwork: "sepolia",
  networks: {
    
    sepolia: {
      url: "https://sepolia.infura.io/v3/da8932a090e84bc8ac665b643d5bf539", // Replace with the actual Sepolia network URL
      accounts: ["0x809a433271b6295c5a9c23dce8d4980a1f6059e16231175f391a8e39a2e5eb81"], // Add your Sepolia private keys for account management
      chainId: 11155111, // Replace with the actual chain ID of Sepolia
    },
  },
  // Other configurations as needed
};
