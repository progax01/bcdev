// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

// Import Ownable contract for access control
import "@openzeppelin/contracts/access/Ownable.sol";

contract KYC is Ownable {
    // Struct to represent KYC data
    struct KYCData {
        bool isVerified;
        string firstName;
        string lastName;
        string documentHash; // Hash of KYC document (e.g., IPFS hash)
    }

    // Mapping from user's Ethereum address to their KYC data
    mapping(address => KYCData) public kycRecords;

    // Event to log KYC verification
    event KYCVerified(address indexed user, string firstName, string lastName);

    // Function to add or update KYC data
    function setKYCData(
        address userAddress,
        bool isVerified,
        string memory firstName,
        string memory lastName,
        string memory documentHash
    ) external onlyOwner {
        kycRecords[userAddress] = KYCData(isVerified, firstName, lastName, documentHash);
        emit KYCVerified(userAddress, firstName, lastName);
    }

    // Function to verify KYC status
    function verifyKYC(address userAddress) external view returns (bool) {
        return kycRecords[userAddress].isVerified;
    }

    // Function to get KYC data for a user
    function getKYCData(address userAddress)
        external
        view
        returns (
            bool isVerified,
            string memory firstName,
            string memory lastName,
            string memory documentHash
        )
    {
        KYCData storage kyc = kycRecords[userAddress];
        return (kyc.isVerified, kyc.firstName, kyc.lastName, kyc.documentHash);
    }
}
