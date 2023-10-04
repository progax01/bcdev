// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Escrow {
    address public buyer;
    address public seller;
    address public escrowAgent;
    uint256 public depositAmount;
    bool public isFundsDeposited;
    bool public isContractActive;

    event FundsDeposited(address indexed _from, uint256 _amount);
    event FundsReleased(address indexed _to, uint256 _amount);

    constructor(address _seller, address _escrowAgent) {
        buyer = msg.sender;
        seller = _seller;
        escrowAgent = _escrowAgent;
    }

    modifier onlyBuyer() {
        require(msg.sender == buyer, "Only the buyer can call this function");
        _;
    }

    modifier onlySeller() {
        require(msg.sender == seller, "Only the seller can call this function");
        _;
    }

    modifier onlyEscrowAgent() {
        require(msg.sender == escrowAgent, "Only the escrow agent can call this function");
        _;
    }

    modifier fundsNotDeposited() {
        require(!isFundsDeposited, "Funds have already been deposited");
        _;
    }

    modifier contractIsActive() {
        require(isContractActive, "Contract is not active");
        _;
    }

    function depositFunds() external payable onlyBuyer fundsNotDeposited {
        require(msg.value > 0, "Deposit amount must be greater than zero");
        depositAmount = msg.value;
        isFundsDeposited = true;
        isContractActive = true;
        emit FundsDeposited(msg.sender, msg.value);
    }

    function releaseFundsToSeller() external onlySeller contractIsActive {
        payable(seller).transfer(depositAmount);
        isFundsDeposited = false;
        isContractActive = false;
        emit FundsReleased(seller, depositAmount);
    }

    function refundFundsToBuyer() external onlyEscrowAgent contractIsActive {
        payable(buyer).transfer(depositAmount);
        isFundsDeposited = false;
        isContractActive = false;
        emit FundsReleased(buyer, depositAmount);
    }

    function getContractBalance() public view returns (uint256) {
        return address(this).balance;
    }
}
