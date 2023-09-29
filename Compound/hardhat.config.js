require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  networks: {
    hardhat: {
      forking: {
        url: `https://mainnet.infura.io/v3/da8932a090e84bc8ac665b643d5bf539`, // Replace with your Infura project ID
      },
    },
  },
  solidity: {
    version: "0.8.0", // Use the desired Solidity version
  },
};