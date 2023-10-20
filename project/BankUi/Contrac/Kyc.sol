// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

// Import Ownable contract for access control


contract KYC  {
    // Struct to represent KYC data
    struct KYCData {
        address userAddress;
        bool isVerified;
        string FullName;
        string Email;
        uint Phone;
        uint Aadhar;
        string Location;
        //string documentHash; // Hash of KYC document (e.g., IPFS hash)

    }

    // Mapping from user's Ethereum address to their KYC data
    mapping(address => KYCData) kycRecords;

    // Event to log KYC verification
    // event KYCVerified(address userAddress,bool isVerified, string FullName, string Email, uint Phone, uint Aadhar,string Location);

    // Function to add or update KYC data
    function setKYCData(
        address userAds,
        string memory fullName,
        string memory email,
        uint phone,
        uint  aadhar,
        string memory location ) public {
            require(kycRecords[userAds].Aadhar == 0,"KYC already Done use");

        kycRecords[userAds] = KYCData(userAds, true , fullName, email, phone, aadhar, location);
        // emit KYCVerified(userAds,true, FullName, Email,Phone,Aadhar,Location);
    }

    // Function to verify KYC status
    function verifyKYC(address verifyAddress) public view returns (bool) {
        return kycRecords[verifyAddress].isVerified;
    }

    // Function to get KYC data for a user
    function getKYCData(address getAddress) public view
        returns (
           address _userAddress,
           bool _isVerified,
        string memory _FullName,
        string memory _Email,
        uint _Phone,
        uint _Aadhar,
        string memory _Location
            
        )
    {
        KYCData storage kyc = kycRecords[getAddress];
        return (kyc.userAddress, kyc.isVerified,kyc.FullName, kyc.Email, kyc.Phone, kyc.Aadhar, kyc.Location );
    }
}
