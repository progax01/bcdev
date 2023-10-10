const {Web3} = require('web3');
const web3 = new Web3('http://127.0.0.1:8545'); // Connect to Ganache's RPC endpoint

const fromAddress = '0x34952640e1e0F1F3cE82da047DCbf5B749c4687E'; // The address with Ether to send from
const toAddress = '0x6B175474E89094C44Da98b954EedeAC495271d0F'; // The unlocked account's address
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
