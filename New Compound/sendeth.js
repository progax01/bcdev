const {Web3} = require('web3');
const web3 = new Web3('http://127.0.0.1:8545'); // Connect to Ganache's RPC endpoint

const fromAddress = '0x34952640e1e0F1F3cE82da047DCbf5B749c4687E'; // The address with Ether to send from
const toAddress = '0x075e72a5eDf65F0A5f44699c7654C1a76941Ddc8'; // The unlocked account's address
const amountInEther = 500; // Amount of Ether to send (in Ether)
 
web3.eth.sendTransaction({
  from: fromAddress,
  to: toAddress,
  value: web3.utils.toWei(amountInEther.toString(), 'ether'),
})
.on('transactionHash', (hash) => {
  console.log(`Transaction hash: ${hash}`);
})
.on('receipt', (receipt) => {
  console.log(`Transaction receipt:`, receipt);
})
.on('error', (error) => {
  console.error(`Transaction error:`, error);
});
