require("dotenv").config();
require("@nomicfoundation/hardhat-toolbox");

const privateKey = process.env.PRIVATE_KEY;

console.log("PRIVATE KEY LENGTH:", privateKey?.length);

if (!privateKey || privateKey.length !== 64) {
  throw new Error("Invalid PRIVATE_KEY. It must be 64 characters.");
}

module.exports = {
  solidity: "0.8.24",
  networks: {
    sepolia: {
      url: process.env.RPC_URL || "",
      accounts: [privateKey],
    },
  },
};
