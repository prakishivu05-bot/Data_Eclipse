// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract DataWipeProof {
    struct ProofRecord {
        string deviceId;
        string beforeHash;
        string afterHash;
        string status;
        uint256 timestamp;
    }

    mapping(uint256 => ProofRecord) public proofs;
    uint256 public totalProofs;

    event ProofStored(uint256 indexed index, string deviceId, string status);

    function storeProof(
        string memory _deviceId,
        string memory _beforeHash,
        string memory _afterHash,
        string memory _status
    ) public {
        proofs[totalProofs] = ProofRecord({
            deviceId: _deviceId,
            beforeHash: _beforeHash,
            afterHash: _afterHash,
            status: _status,
            timestamp: block.timestamp
        });
        
        emit ProofStored(totalProofs, _deviceId, _status);
        totalProofs++;
    }

    function getProof(uint256 index) public view returns (ProofRecord memory) {
        require(index < totalProofs, "Proof does not exist");
        return proofs[index];
    }

    function getTotalProofs() public view returns (uint256) {
        return totalProofs;
    }
}
