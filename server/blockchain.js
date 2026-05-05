import { ethers } from 'ethers';
import dotenv from 'dotenv';
dotenv.config();

// New Contract ABI matching DataWipeProof
const contractABI = [
  "function storeProof(string memory _deviceId, string memory _beforeHash, string memory _afterHash, string memory _status) public",
  "function getProof(uint256 index) public view returns (tuple(string deviceId, string beforeHash, string afterHash, string status, uint256 timestamp))",
  "function getTotalProofs() public view returns (uint256)"
];

export const storeProof = async (data) => {
  try {
    const rpcUrl = process.env.RPC_URL;
    const privateKey = process.env.PRIVATE_KEY;
    const contractAddress = process.env.CONTRACT_ADDRESS;

    if (!rpcUrl || !privateKey || !contractAddress) {
      throw new Error("Missing blockchain environment variables in root .env.");
    }

    const provider = new ethers.JsonRpcProvider(rpcUrl);
    const wallet = new ethers.Wallet(privateKey, provider);
    const contract = new ethers.Contract(contractAddress, contractABI, wallet);

    const { deviceId, beforeHash, afterHash, status } = data;

    // Call the contract
    const tx = await contract.storeProof(deviceId, beforeHash, afterHash, status);
    
    // Wait for transaction confirmation
    const receipt = await tx.wait();
    
    return { success: true, txHash: receipt.hash };
  } catch (error) {
    console.error("Blockchain anchoring error:", error);
    return { success: false, error: error.message };
  }
};
