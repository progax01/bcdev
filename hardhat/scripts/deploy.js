// Import Hardhat and ethers
const { ethers } = require("hardhat");

async function main() {
  // Get the accounts from Hardhat (by default, accounts[0] is the deployer)
  const [deployer] = await ethers.getSigners();

  console.log("Deploying Manager contract with the account:", deployer.address);

  // Deploy the Manager contract
  const Manager = await ethers.getContractFactory("Manager");
  const manager = await Manager.deploy("Type1", "Type2");

  await manager.deployed();

  console.log("Manager contract address:", manager.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("eor",error);
    process.exit(1);
  });
