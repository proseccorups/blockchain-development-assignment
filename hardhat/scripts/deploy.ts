const hre = require("hardhat");
async function main() {
  const CarOwnership = await hre.ethers.getContractFactory("CarOwnership");
  const carOwnership = await CarOwnership.deploy();

  await carOwnership.deployed();

  console.log("Greeter deployed to:", carOwnership.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
