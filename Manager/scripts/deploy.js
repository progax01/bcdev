//const { ethers, upgrades } = require("hardhat");

async function main() {
  // Replace these values with your contract's constructor arguments
  const type1 = "admin";
  const type2 = "student";

  // Get the accounts from the local Hardhat network
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  // Deploy the Manager contract
  const Manager = await ethers.getContractFactory("manager");
  const manager = await Manager.deploy(type1, type2);

  await manager.deployed();

  console.log("Manager contract address:", manager.address);

  // Optionally, you can upgrade the contract using Hardhat Upgrades Plugin
  // const upgradedManager = await upgrades.upgradeProxy(manager.address, Manager);

  // console.log("Upgraded Manager contract address:", upgradedManager.address);
}

// Run the deployment script
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
