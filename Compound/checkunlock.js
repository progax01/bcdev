const { ethers } = require('hardhat');

async function main() {
  // Get an Ethereum wallet connected to the forked mainnet
  const provider = new ethers.providers.JsonRpcProvider();
  const [wallet] = provider.getWallets();

  // Example: Interact with a contract on the forked mainnet
  const contractAddress = '0x60FaAe176336dAb62e284Fe19B885B095d29fB7F'; // Replace with the contract address you want to interact with
  const contract = new ethers.Contract(contractAddress, ['functionName()'], wallet);

  const result = await contract.functionName();
  console.log('Result:', result);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
