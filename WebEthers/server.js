const express = require('express');
const { ethers,JsonRpcProvider,parseEther } = require('ethers');

const provider = new JsonRpcProvider("https://sepolia.infura.io/v3/d1ca998e042a43219dbc26662e0546c0");

const app = express();
const port = 3000;
app.use(express.json());

const privateKey = "0x37b0abb593520621efb356e310e682ba34082b3d4bbb8ea35fc463c38120f2fd";
const ownerAddress = "0x6d77FA0c0cc1181ba128a25e25594f004e03a141";

app.get('/connect-to-ethereum-node', async (req, res) => {
  try {
    const network = await provider.getNetwork();
    res.json({ network });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
  
app.post('/getBalance', async (req, res) => {
    try {
        const balance = await provider.getBalance(ownerAddress);
        res.status(200).json({ success: true, message: `Balance is ${balance.toString()}` });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ success: false, message: 'Error getting balance.' });
    }
});

app.post('/generate-ethereum-account', (req, res) => {
    try {
      const wallet = ethers.Wallet.createRandom();
      res.json({
        address: wallet.address,
        privateKey: wallet.privateKey,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post('/estimate-gas', async (req, res) => {
    try {
      const { recipientAddress, amountInEther } = req.body;
      const gasLimit = await provider.estimateGas({
        to: recipientAddress,
        value: parseEther(amountInEther.toString()),
      });
      res.json({ gasLimit: gasLimit.toString() });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post('/send-ethereum-transaction', async (req, res) => {
    try {
      const {recipientAddress, amountInEther} = req.body;
      const wallet = new ethers.Wallet(privateKey, provider);
  
      const tx = await wallet.sendTransaction({
        from: ownerAddress,
        to: recipientAddress,
        value: parseEther(amountInEther.toString()),
      });
  
      await tx.wait();
      res.json({ transactionHash: tx.hash });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
 
  app.post('/send-ethereum-transaction-custom-gas', async (req, res) => {
    try {
      const { recipientAddress, amountInEther, gasPriceInGwei } = req.body;
      const wallet = new ethers.Wallet(privateKey, provider);
  
      const gasPrice = ethers.utils.parseUnits(gasPriceInGwei, 'gwei');
  
      const tx = await wallet.sendTransaction({
        from: ownerAddress,
        to: recipientAddress,
        value: ethers.utils.parseEther(amountInEther.toString()),
        gasPrice, // Use the custom gas price in Gwei
      });
  
      await tx.wait();
      res.json({ transactionHash: tx.hash });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post('/send-ethereum-transaction-with-data', async (req, res) => {
    try {
      const { recipientAddress, amountInEther, data } = req.body;
      const wallet = new ethers.Wallet(privateKey, provider);
  
      const tx = await wallet.sendTransaction({
        from: ownerAddress,
        to: recipientAddress,
        value: ethers.utils.parseEther(amountInEther.toString()),
        data: data, // Include custom transaction data (e.g., for smart contract interaction)
      });
  
      await tx.wait();
      res.json({ transactionHash: tx.hash });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});