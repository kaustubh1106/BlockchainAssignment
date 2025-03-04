const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("AssignmentToken", function () {
  let Token, token, owner, addr1, addr2;

  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();
    Token = await ethers.getContractFactory("AssignmentToken");
    token = await Token.deploy("AssignmentCoin", "ASC", 10000);
  });

  it("Should deploy with correct initial supply", async function () {
    const ownerBalance = await token.balanceOf(owner.address);
    expect(ownerBalance).to.equal(ethers.parseUnits("10000", 18));
  });

  it("Should allow owner to mint tokens", async function () {
    await token.mint(addr1.address, 100);
    const addr1Balance = await token.balanceOf(addr1.address);
    expect(addr1Balance).to.equal(ethers.parseUnits("100", 18));
  });

  it("Should not allow non-minters to mint tokens", async function () {
    await expect(token.connect(addr1).mint(addr2.address, 100)).to.be.reverted;
  });

  it("Should allow users to burn their tokens", async function () {
    await token.mint(addr1.address, 100);
    await token.connect(addr1).burn(50);
    expect(await token.balanceOf(addr1.address)).to.equal(ethers.parseUnits("50", 18));
  });

  it("Should not allow burning more tokens than balance", async function () {
    await expect(token.connect(addr1).burn(50)).to.be.reverted;
  });

  it("Should allow users to claim airdrop", async function () {
    await token.connect(addr1).claimAirdrop();
    expect(await token.balanceOf(addr1.address)).to.equal(ethers.parseUnits("100", 18));
  });

  it("Should not allow claiming airdrop twice", async function () {
    await token.connect(addr1).claimAirdrop();
    await expect(token.connect(addr1).claimAirdrop()).to.be.revertedWith("Airdrop already claimed!");
  });

  it("Should correctly return user roles", async function () {
    expect(await token.getUserRole(owner.address)).to.equal(2); // Admin
    expect(await token.getUserRole(addr1.address)).to.equal(0); // USER
    await token.grantMinterRole(addr1.address);
    expect(await token.getUserRole(addr1.address)).to.equal(1); // Mint
  });
});
