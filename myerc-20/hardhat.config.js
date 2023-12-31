/** @type import('hardhat/config').HardhatUserConfig */
require('dotenv').config();
require('@nomiclabs/hardhat-waffle');

const Sp_url=process.env.URL
const PVT_key= process.env.PRIVATE_KEY
module.exports = {
  solidity: "0.8.19",
  networks: {
    sepolia:{
      url: Sp_url,
      accounts:[PVT_key],
    },
  },
};
