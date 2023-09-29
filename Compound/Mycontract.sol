// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "./CTokenInterface.sol"; // You'll need to import the Compound cToken interface
import "./Mynft.sol";

interface Comptroller {
    /// @notice Indicator that this is a Comptroller contract (for inspection)

    /*** Assets You Are In ***/

    function enterMarkets(address[] calldata cTokens)
        external
        returns (uint256[] memory);

    function exitMarket(address cToken) external returns (uint256);

    /*** Policy Hooks ***/

    function mintAllowed(
        address cToken,
        address minter,
        uint256 mintAmount
    ) external returns (uint256);

    function mintVerify(
        address cToken,
        address minter,
        uint256 mintAmount,
        uint256 mintTokens
    ) external;

    function redeemAllowed(
        address cToken,
        address redeemer,
        uint256 redeemTokens
    ) external returns (uint256);

    function redeemVerify(
        address cToken,
        address redeemer,
        uint256 redeemAmount,
        uint256 redeemTokens
    ) external;

    function borrowAllowed(
        address cToken,
        address borrower,
        uint256 borrowAmount
    ) external returns (uint256);

    function borrowVerify(
        address cToken,
        address borrower,
        uint256 borrowAmount
    ) external;

    function repayBorrowAllowed(
        address cToken,
        address payer,
        address borrower,
        uint256 repayAmount
    ) external returns (uint256);

    function repayBorrowVerify(
        address cToken,
        address payer,
        address borrower,
        uint256 repayAmount,
        uint256 borrowerIndex
    ) external;

    function liquidateBorrowAllowed(
        address cTokenBorrowed,
        address cTokenCollateral,
        address liquidator,
        address borrower,
        uint256 repayAmount
    ) external returns (uint256);

    function liquidateBorrowVerify(
        address cTokenBorrowed,
        address cTokenCollateral,
        address liquidator,
        address borrower,
        uint256 repayAmount,
        uint256 seizeTokens
    ) external;

    function seizeAllowed(
        address cTokenCollateral,
        address cTokenBorrowed,
        address liquidator,
        address borrower,
        uint256 seizeTokens
    ) external returns (uint256);

    function seizeVerify(
        address cTokenCollateral,
        address cTokenBorrowed,
        address liquidator,
        address borrower,
        uint256 seizeTokens
    ) external;

    function transferAllowed(
        address cToken,
        address src,
        address dst,
        uint256 transferTokens
    ) external returns (uint256);

    function transferVerify(
        address cToken,
        address src,
        address dst,
        uint256 transferTokens
    ) external;

    /*** Liquidity/Liquidation Calculations ***/

    function liquidateCalculateSeizeTokens(
        address cTokenBorrowed,
        address cTokenCollateral,
        uint256 repayAmount
    ) external view returns (uint256, uint256);
}

contract CompoundSupply {
    using SafeERC20 for IERC20;
    Comptroller public compoundfunction;
    address public owner;
    IERC20 public daiToken;
    CErc20Interface public cDaiToken; // Replace with the appropriate cToken for your asset
    Mynft public NftInstance;

    mapping( address=> mapping(uint => uint)) userCtokenamount ;

    constructor(
        address _compaddress,
        address _daiTokenAddress,
        address _cDaiTokenAddress,
        address _Mynft
    ) {
        owner = msg.sender;
        compoundfunction = Comptroller(_compaddress);
        daiToken = IERC20(_daiTokenAddress);
        cDaiToken = CErc20Interface(_cDaiTokenAddress);
        NftInstance = Mynft(_Mynft);
    }

    // Deposit DAI into the Compound protocol
    function deposit(uint256 amount) external {
        
        uint tokenid=0;
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

        userCtokenamount[msg.sender][tokenid]=amount; 
    }


    //@Called by user 

    function withdraw(uint256 tokenID) external {

        // // check token id widthdrawn done or not
        // require( NftInstance.isTokenDrawn[tokenID] == false,
        //     "Amount already widthdrawn"
        // );

        //Check for token Ownership
        require(
            NftInstance.TokenOwner[tokenID] == msg.sender,
            "Your are not owner of this Token"
        );

        //burn nft
        NftInstance.burn(tokenID);

        // Check for Amount given for nft minting

        uint Amount= NftInstance.TokenBuyAmount[msg.sender][tokenID];

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
        require(daiToken.Transfer(msg.sender, sndAmount),"Faild to send User Amount");

        //Now Burn the user NFT
        NftInstance.burn(tokenID);

        //Make the state True;

        NftInstance.isTokenDrawn[tokenID] = true;

    }

    // Check the cDAI balance of this contract
    function cDaiBalance() external view returns (uint256) {
        return cDaiToken.balanceOf(msg.sender);
    }

    function DaiBalance() external view returns (uint256) {
        return daiToken.balanceOf(msg.sender);
    }

    

    // Allow the owner to withdraw Earned tokens interest
    function withdrawExcessTokens(address tokenAddress) external {
        require(msg.sender == owner, "Only the owner can call this function");
        require(tokenAddress != address(cDaiToken), "Cannot withdraw cDAI");
        IERC20 token = IERC20(tokenAddress);
        uint256 balance = token.balanceOf(address(this));
        require(balance > 0, "No balance to withdraw");
        token.Transfer(owner, balance);
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
}
