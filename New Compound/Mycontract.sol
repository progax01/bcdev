// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;


import "./Contract/CTokenInterfaces.sol"; // You'll need to import the Compound cToken interface

import "./Mynft.sol";
import "./ERC20.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
//import "https://github.com/compound-finance/compound-protocol/blob/master/contracts/ComptrollerInterface.sol";
// interface CErc20Interface {
//         function transfer(address dst, uint amount) external returns (bool);
//     function transferFrom(address src, address dst, uint amount) external returns (bool);
//     function approve(address spender, uint amount) external returns (bool);
//     function allowance(address owner, address spender) external view returns (uint);
//     function balanceOf(address owner) external view returns (uint);
//     function balanceOfUnderlying(address owner) external returns (uint);
 
//     function borrowRatePerBlock() external view returns (uint);
//     function supplyRatePerBlock() external view returns (uint);

//         function mint(uint mintAmount) external returns (uint);
//     function redeem(uint redeemTokens) external returns (uint);
//     function redeemUnderlying(uint redeemAmount) external returns (uint);
//     function exchangeRateStored() external view returns (uint);

// }
 
 interface Usdt {
     function approve(address spender, uint amount) external returns (bool);
     function transferFrom(address from, address to, uint256 value)  external returns (bool);
    function transfer(address to, uint256 value)  external returns (bool);
    function balanceOf(address add) external view returns(uint);

 }
 


 interface CTokenInterfaces{
     function mint(uint mintAmount)   external returns (uint);
    function exchangeRateStored()   external view returns (uint);
      function redeem(uint redeemTokens)   external returns (uint);
   function redeemUnderlying(uint redeemAmount)  external returns (uint);
     function exchangeRateCurrent()   external returns (uint);
     function balanceOf(address owner)  external view returns (uint);


 }
 
contract CompoundSupply {
    using Counters for Counters.Counter;
    mapping(address => mapping(uint256 => uint256)) TokenBuyAmount;
    mapping(uint =>address) public TokenOwner;
    mapping(uint=> bool) public isTokenDrawn;
    Counters.Counter private _tokenIdCounter;

    //using SafeERC20 for IERC20;

  
    address public owner;
    Usdt public usdtToken;
    CTokenInterfaces public cUsdtToken; // Replace with the appropriate cToken for your asset
    Mynft public NftInstance;
   ComptrollerInterface public comptroller;

    mapping( address=> mapping(uint => uint)) userCtokenamount ;
 address _cusdtTokenAddress;

    constructor() {
        owner = msg.sender;
       _cusdtTokenAddress= 0x5A74332C881Ea4844CcbD8458e0B6a9B04ddb716;
        usdtToken = Usdt(0x79C950C7446B234a6Ad53B908fBF342b01c4d446);
        cUsdtToken = CTokenInterfaces(0x5A74332C881Ea4844CcbD8458e0B6a9B04ddb716);
        NftInstance = Mynft(0xC3aC749903716306b4CeD4E9d96D08EAcdcEf17F);
           comptroller = ComptrollerInterface(0x05Df6C772A563FfB37fD3E04C1A279Fb30228621);

 // Enter the market
        address[] memory cTokens = new address[](1);
        cTokens[0] =0x5A74332C881Ea4844CcbD8458e0B6a9B04ddb716;
        comptroller.enterMarkets(cTokens);

    }

    // Deposit DAI into the Compound protocol
    function deposit(uint256 amount) public {
        address userads=msg.sender;
        uint256 tokenId = _tokenIdCounter.current();
        //Transfer funds to contract from user
        require(amount > 0, "Amount must be greater than zero");

        //Transfer from user to contract
       // require(usdtToken.approve(address(this), amount), "Allowance not set");
  require(usdtToken.transferFrom(userads, address(this), amount), " Transfer Fail amount not transfered" ); //to be called by contract

        // Now minting NFT starts
     NftInstance.mintNFT(userads, amount);

        //@compound protocol tranfer

        // Get ctoken in return 
    
        //approving compound for usdt trnas
require( usdtToken.approve(_cusdtTokenAddress, amount),"compound approve failed");

uint camount = cUsdtToken.balanceOf(address(this));


         uint256 mintResult = cUsdtToken.mint(amount);
         require(mintResult == 0, "cUsdt minting failed");

    

        // //@Map the Ctoken received with the Token ID
        // uint256 currentExchangeRate =  cUsdtToken.exchangeRateCurrent();
        // uint256 cTokensReceived = (amount * 10 ** 8) / currentExchangeRate;
        


        TokenBuyAmount[userads][tokenId]=cUsdtToken.balanceOf(address(this))  - camount; 
        isTokenDrawn[tokenId]=false;
        TokenOwner[tokenId]=userads;
        _tokenIdCounter.increment();
    }

    //@Called by user 

    function withdraw(uint256 tokenID) external {

        address userads=msg.sender; //saving user addresss
        
        // // check token id widthdrawn done or not
         require( isTokenDrawn[tokenID] == false, "Amount already widthdrawn");

        //Check for token Ownership
        require(TokenOwner[tokenID] == userads, "Your are not owner of this Token");

        uint usdtbal= usdtToken.balanceOf(address(this));
        // Check for Amount given for nft minting

        uint Amount= TokenBuyAmount[userads][tokenID];

        //@@Contract Ctoken amount
        // Calculate the equivalent amount of cTokens to withdraw,Get the exchange rate
       
        //Giving back the Ctoken to contr
         
        uint256 redeemResult = cUsdtToken.redeem(Amount);
        require(redeemResult == 0, "usdt redeeming failed");



        // Calculate the interest earned 
uint TotalAmount =usdtToken.balanceOf(address(this));

        uint256 interestEarned = TotalAmount - usdtbal;



        //@@@ Transfering Total amount with interest to the Contract
        // Transfer the Dai tokens to the Contract
      
        //@@ sending amount to user
        uint sndAmount= TotalAmount-interestEarned;
        require(usdtToken.transfer(msg.sender, sndAmount),"Faild to send User Amount");

        //Now Burn the user NFT
        NftInstance.burn(tokenID);

        //Make the state True;

        isTokenDrawn[tokenID] = true;

    }

    // Check the cDAI balance of this contract
    function cUsdtBalance(address add) external view returns (uint256) {
        return cUsdtToken.balanceOf(add);
    }

    function usdtBalance(address add) external view returns (uint256) {
        return usdtToken.balanceOf(add);
    }

    


    //@@@ Know you interest Earned

     function calculateInterestEarned() external view returns (uint256) {
        // Get the user's balance in cTokens
        require(msg.sender==owner,"your are not auth to call this fun");

        uint256 cTokenBalance = cUsdtToken.balanceOf(msg.sender);

        // Get the exchange rate (how many underlying tokens you get per cToken)
        uint256 exchangeRate = cUsdtToken.exchangeRateStored();

        // Calculate the user's balance in underlying tokens
        uint256 Balance = cTokenBalance * exchangeRate / 1e18;

        // Calculate the interest earned (balance in underlying tokens - supplied amount)
        uint256 suppliedAmount = Balance - cTokenBalance;
        return suppliedAmount;
    }



}
