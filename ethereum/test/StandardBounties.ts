const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Deploy", function () {
    it("Should deploy the contract", async function() {
        const StandardBounties = await ethers.getContractFactory("StandardBounties");
        const standardBounties = await StandardBounties.deploy();
        await standardBounties.deployed();
        console.log(standardBounties.address);
    });
});