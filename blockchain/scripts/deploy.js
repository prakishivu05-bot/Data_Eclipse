const hre = require("hardhat");

async function main() {
  console.log("Deploying DataWipeProof contract...");

  const DataWipeProof = await hre.ethers.getContractFactory("DataWipeProof");
  const contract = await DataWipeProof.deploy();

  await contract.waitForDeployment();

  console.log("DataWipeProof deployed to:", await contract.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
