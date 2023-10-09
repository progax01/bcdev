const {Web3} = require('web3');
const web3 = new Web3('http://127.0.0.1:8545'); // Connect to Ganache's RPC endpoint

const fromAddress = '0xe6c8E997C1871B69516476e0cA290281f041037A'; // The address with Ether to send from (an unlocked account)
const toAddress = '0x6B175474E89094C44Da98b954EedeAC495271d0F'; // The address you want to send Ether to
const amountInWei = web3.utils.toWei('1', 'ether'); // Amount of Ether to send (in Wei)

web3.eth.sendTransaction({
  from: fromAddress,
  to: toAddress,
  value: web3.utils.toHex(amountInWei),
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
