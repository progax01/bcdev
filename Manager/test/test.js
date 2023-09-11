const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Manager Contract", function () {
  let Manager;
  let manager;
  let owner;
  let addr1;
  let addr2;

  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();

    Manager = await ethers.getContractFactory("manager");
    manager = await Manager.deploy("Type1", "Type2");
    await manager.deployed();
  });

  it("Should register a user", async function () {
    const tx = await manager.connect(addr1).userRegister("Type1");
    await tx.wait();

    const userType = await manager.usertype(addr1.address);
    expect(userType).to.equal("Type1");
  });

  it("Should not allow an invalid type", async function () {
    await expect(manager.connect(addr1).userRegister("InvalidType")).to.be.revertedWith("Entered Type does not match");
  });

  it("Should return the correct user type", async function () {
    await manager.connect(addr1).userRegister("Type1");
    await manager.connect(addr2).userRegister("Type2");

    const userType1 = await manager.usertype(addr1.address);
    const userType2 = await manager.usertype(addr2.address);

    expect(userType1).to.equal("Type1");
    expect(userType2).to.equal("Type2");
  });

  it("Should return an empty string for an unregistered address", async function () {
    const userType = await manager.usertype(owner.address);
    expect(userType).to.equal("");
  });

  it("Should not allow a user to register twice", async function () {
    await manager.connect(addr1).userRegister("Type1");
    await expect(manager.connect(addr1).userRegister("Type2")).to.be.revertedWith("You have already registered");
  });
});
