// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
//import "./CTokenInterface.sol"; // You'll need to import the Compound cToken interface
import "./Mynft.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

interface CErc20Interface {
        function transfer(address dst, uint amount) external returns (bool);
    function transferFrom(address src, address dst, uint amount) external returns (bool);
    function approve(address spender, uint amount) external returns (bool);
    function allowance(address owner, address spender) external view returns (uint);
    function balanceOf(address owner) external view returns (uint);
    function balanceOfUnderlying(address owner) external returns (uint);
 
    function borrowRatePerBlock() external view returns (uint);
    function supplyRatePerBlock() external view returns (uint);

        function mint(uint mintAmount) external returns (uint);
    function redeem(uint redeemTokens) external returns (uint);
    function redeemUnderlying(uint redeemAmount) external returns (uint);
    function exchangeRateStored() external view returns (uint);

}
 
 
 
contract CompoundSupply {
    using Counters for Counters.Counter;
    mapping(address => mapping(uint256 => uint256)) TokenBuyAmount;
    mapping(uint =>address) public TokenOwner;
    mapping(uint=> bool) public isTokenDrawn;
    Counters.Counter private _tokenIdCounter;

    using SafeERC20 for IERC20;

  
    address public owner;
    IERC20 public daiToken;
    CErc20Interface public cDaiToken; // Replace with the appropriate cToken for your asset
    Mynft public NftInstance;

    mapping( address=> mapping(uint => uint)) userCtokenamount ;

    constructor(

        address _daiTokenAddress,
        address _cDaiTokenAddress,
        address _Mynft
    ) {
        owner = msg.sender;
      
        daiToken = IERC20(_daiTokenAddress);
        cDaiToken = CErc20Interface(_cDaiTokenAddress);
        NftInstance = Mynft(_Mynft);
    }

    // Deposit DAI into the Compound protocol
    function deposit(uint256 amount) external {
        
        uint256 tokenId = _tokenIdCounter.current();
        //Transfer funds to contract from user
        require(amount > 0, "Amount must be greater than zero");

        //Transfer from user to contract
        require(daiToken.approve(address(this), amount), "Allowance not set");
        require(daiToken.transferFrom(msg.sender, address(this), amount), "Transfer Fail" ); //to be called by contract

        // Now minting NFT starts
        NftInstance.safeMint(msg.sender, amount);

        //@compound protocol tranfer
        //@Approve the transfer of Dai token to Compount protocol from contract
        require(daiToken.approve(address(cDaiToken), amount), "Approval failed");

        // Get ctoken in return 
    
        uint256 mintResult = cDaiToken.mint(amount);
        require(mintResult == 0, "cDAI minting failed");

        //@Map the Ctoken received with the Token ID

        TokenBuyAmount[msg.sender][tokenId]=amount; 
        isTokenDrawn[tokenId]=false;
        TokenOwner[tokenId]=msg.sender;
        _tokenIdCounter.increment();
    }


    //@Called by user 

    function withdraw(uint256 tokenID) external {

        // // check token id widthdrawn done or not
         require( isTokenDrawn[tokenID] == false, "Amount already widthdrawn");

        //Check for token Ownership
        require(
            TokenOwner[tokenID] == msg.sender,
            "Your are not owner of this Token"
        );

        //burn nft
        NftInstance.burn(tokenID);

        // Check for Amount given for nft minting

        uint Amount= TokenBuyAmount[msg.sender][tokenID];

        //@@Contract Ctoken amount

        // Get the exchange rate, tokens you get per cToken
        //uint256 exchangeRate = cDaiToken.exchangeRateStored();


        // Calculate the equivalent amount of cTokens to withdraw,Get the exchange rate
        uint256 TotalAmount = Amount *  cDaiToken.exchangeRateStored() / 1e18 ;

        // Calculate the interest earned 
        uint256 interestEarned = TotalAmount - Amount;

        //Giving back the Ctoken to contract
        uint256 redeemResult = cDaiToken.redeem(Amount);
        require(redeemResult == 0, "cDAI redeeming failed");


        //@@@ Transfering Total amount with interest to the Contract

        // Transfer the Dai tokens to the Contract
        require(daiToken.transfer(address(this), TotalAmount), "Transfer failed");
      
        //@@ sending amount to user

        uint sndAmount= TotalAmount-interestEarned;
        require(daiToken.transfer(msg.sender, sndAmount),"Faild to send User Amount");

        //Now Burn the user NFT
        NftInstance.burn(tokenID);

        //Make the state True;

        isTokenDrawn[tokenID] = true;

    }

    // Check the cDAI balance of this contract
    function cDaiBalance() external view returns (uint256) {
        return cDaiToken.balanceOf(msg.sender);
    }

    function DaiBalance() external view returns (uint256) {
        return daiToken.balanceOf(msg.sender);
    }

    


    //@@@ Know you interest Earned

     function calculateInterestEarned() external view returns (uint256) {
        // Get the user's balance in cTokens
        require(msg.sender==owner,"your are not auth to call this fun");

        uint256 cTokenBalance = cDaiToken.balanceOf(msg.sender);

        // Get the exchange rate (how many underlying tokens you get per cToken)
        uint256 exchangeRate = cDaiToken.exchangeRateStored();

        // Calculate the user's balance in underlying tokens
        uint256 underlyingBalance = cTokenBalance * exchangeRate / 1e18;

        // Calculate the interest earned (balance in underlying tokens - supplied amount)
        uint256 suppliedAmount = underlyingBalance - cTokenBalance;
        return suppliedAmount;
    }



    // Allow the owner to withdraw Earned tokens interest
    function withdrawExcessTokens(address tokenAddress) external {
        require(msg.sender == owner, "Only the owner can call this function");
        require(tokenAddress != address(cDaiToken), "Cannot withdraw cDAI");
        IERC20 token = IERC20(tokenAddress);
        uint256 balance = token.balanceOf(address(this));
        require(balance > 0, "No balance to withdraw");
        token.transfer(owner, balance);
    }
}
