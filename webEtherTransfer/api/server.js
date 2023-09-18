const express = require('express');
const app = express();
const {Web3} = require('web3');
const dotenv = require('dotenv');

dotenv.config();

const web3 = new Web3(new Web3.providers.HttpProvider('https://sepolia.infura.io/v3/da8932a090e84bc8ac665b643d5bf539'));

app.use(express.json());



app.post('/transfer', async (req, res) => {
  const { toAddress, amount } = req.body;
 const sndamount= web3.utils.toWei(amount, 'ether');
  //console.log("wie", sndamount,typeof(sndamount));

  try {
    const privateKey = process.env.PRIVATE_KEY;
    const senderAddress = web3.eth.accounts.privateKeyToAccount(privateKey).address;
    
    const nonce = await web3.eth.getTransactionCount(senderAddress);
    const gasPrice = await web3.eth.getGasPrice();
    const gasLimit = 500000; // Standard gas limit for Ether transfer
    
console.log("amount befor:" ,amount);
    const raTransaction = {
        from:senderAddress,
      to: toAddress,
      value: web3.utils.toHex(amount),
      gas:500000,
      gasPrice: web3.utils.toHex(gasPrice),
    };
    console.log("value", raTransaction.value);

    const signedTx = await web3.eth.accounts.signTransaction(raTransaction, privateKey);
    const txHash = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);

    res.json({ transactionHash:txHash.transactionHash.toString()});
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Transaction failed' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

