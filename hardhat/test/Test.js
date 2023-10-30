// SPDX-License-Identifier: MIT
const { expect } = require("chai");
const { ethers } = require("hardhat"); // Import ethers for contract interactions

describe("Manager Contract", function () {
  let managerInstance;
  let accounts;
  before(async () => {
    accounts = await ethers.getSigners(); // Retrieve accounts for testing
    const Manager = await ethers.getContractFactory("Manager");
    managerInstance = await Manager.deploy("Type1", "Type2", { from: accounts[0].address });
    await managerInstance.deployed();
  });

  it("should allow users to register with valid user types", async () => {
    // Register a user with Type1
    const registration1 = await managerInstance.userRegister("Type1", { from: accounts[1].address });
    expect(registration1).to.equal("User registered successfully");

    // Register a user with Type2
    const registration2 = await managerInstance.userRegister("Type2", { from: accounts[2].address });
    expect(registration2).to.equal("User registered successfully");
  });


  it("should not allow users to register with invalid user types", async () => {
    try {
      // Try to register a user with an invalid type
      await managerInstance.userRegister("InvalidType", { from: accounts[3].address });
      // The code will reach here if the registration succeeded, which is not expected
      expect.fail("Registration with an invalid type should fail");
    } catch (error) {
      expect(error.message).to.include("Entered Type doesnot match");
    }
  });

  it("should not allow users to register if they have already registered", async () => {
    try {
      // Try to register the same user again with the same type
      await managerInstance.userRegister("Type1", { from: accounts[1].address });
      // The code will reach here if the registration succeeded, which is not expected
      expect.fail("Registration of the same user should fail");
    } catch (error) {
      expect(error.message).to.include("You have already registered");
    }
  });

  it("should return the correct user type", async () => {
    const userType1 = await managerInstance.usertype(accounts[1].address);
    const userType2 = await managerInstance.usertype(accounts[2].address);
    const userType3 = await managerInstance.usertype(accounts[3].address);

    expect(userType1).to.equal("Type1");
    expect(userType2).to.equal("Type2");
    expect(userType3).to.equal("");
  });

  it("should return a list of all registered users and their types", async () => {
    const [users, types] = await managerInstance.viewall();
    const userCount = users.length;

    expect(userCount).to.equal(2);

    expect(users[0]).to.equal(accounts[1].address);
    expect(users[1]).to.equal(accounts[2].address);

    expect(types[0]).to.equal("Type1");
    expect(types[1]).to.equal("Type2");
  });
});
