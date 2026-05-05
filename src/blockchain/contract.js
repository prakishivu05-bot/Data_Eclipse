import { ethers } from 'ethers';

export const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS;

export const CONTRACT_ABI = [
  "function storeProof(string memory _deviceId, string memory _beforeHash, string memory _afterHash, string memory _status) public",
  "function getProof(uint256 index) public view returns (tuple(string deviceId, string beforeHash, string afterHash, string status, uint256 timestamp))",
  "function getTotalProofs() public view returns (uint256)",
  "event ProofStored(uint256 indexed index, string deviceId, string status)"
];

/**
 * Stores wipe proof directly from frontend using MetaMask
 */
export async function storeProofFromFrontend(wipeData) {
  try {
    if (!window.ethereum) {
      throw new Error("MetaMask is not installed. Please install it to interact with the blockchain.");
    }

    // Request account access
    await window.ethereum.request({ method: 'eth_requestAccounts' });

    // Ensure we are on Sepolia testnet (chain ID 11155111 / 0xaa36a7)
    const targetChainId = '0xaa36a7';
    const currentChainId = await window.ethereum.request({ method: 'eth_chainId' });
    
    if (currentChainId !== targetChainId && currentChainId !== '11155111') {
      try {
        // Attempt to switch the user to Sepolia
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: targetChainId }],
        });
      } catch (switchError) {
        // This error code indicates that the chain has not been added to MetaMask.
        if (switchError.code === 4902) {
          try {
            await window.ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [{
                chainId: targetChainId,
                chainName: 'Sepolia test network',
                rpcUrls: ['https://rpc.sepolia.org'],
                nativeCurrency: { name: 'Sepolia ETH', symbol: 'SEP', decimals: 18 },
                blockExplorerUrls: ['https://sepolia.etherscan.io']
              }],
            });
          } catch (addError) {
            throw new Error("Failed to add Sepolia network. Please add it manually.");
          }
        } else {
          throw new Error("Please switch your MetaMask network to Sepolia Testnet manually.");
        }
      }
    }

    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    
    const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

    const { deviceId, beforeHash, afterHash, status } = wipeData;

    console.log("Sending transaction...");
    // Send transaction
    const tx = await contract.storeProof(deviceId, beforeHash, afterHash, status);
    
    // Wait for confirmation
    const receipt = await tx.wait();
    console.log("Transaction confirmed");
    console.log("TX HASH:", receipt.hash);

    return { success: true, txHash: receipt.hash };
  } catch (error) {
    console.error("Blockchain anchoring error:", error);
    return { success: false, error: error.message || "Failed to store proof" };
  }
}
