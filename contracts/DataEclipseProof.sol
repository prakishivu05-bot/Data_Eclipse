// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract DataEclipseProof {
    struct ProofRecord {
        string deviceId;
        string beforeHash;
        string afterHash;
        string certificateHash;
        uint256 timestamp;
    }

    mapping(uint256 => ProofRecord) public records;
    uint256 public recordCount;

    event ProofStored(uint256 indexed index, string deviceId, string certificateHash);

    function storeProof(
        string memory _deviceId,
        string memory _beforeHash,
        string memory _afterHash,
        string memory _certificateHash
    ) public {
        records[recordCount] = ProofRecord({
            deviceId: _deviceId,
            beforeHash: _beforeHash,
            afterHash: _afterHash,
            certificateHash: _certificateHash,
            timestamp: block.timestamp
        });
        
        emit ProofStored(recordCount, _deviceId, _certificateHash);
        recordCount++;
    }

    function getRecord(uint256 index) public view returns (ProofRecord memory) {
        require(index < recordCount, "Record does not exist");
        return records[index];
    }
}
