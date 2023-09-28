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

    constructor(address _compaddress, address _daiTokenAddress, address _cDaiTokenAddress, address _Mynft) {
        owner = msg.sender;
        compoundfunction= Comptroller(_compaddress);
        daiToken = IERC20(_daiTokenAddress);
        cDaiToken = CErc20Interface(_cDaiTokenAddress);
        NftInstance = Mynft(_Mynft);
    }

    // Deposit DAI into the Compound protocol
    function deposit(uint256 amount) external {

        //Transfer funds to contract from user
        require(amount > 0, "Amount must be greater than zero");
        require( daiToken.approve( address(this), amount) , "Allowance not set" );
        requrie(daiToken.transferFrom(msg.sender, address(this), amount), "Transfer Fail"); //to be called by contract 
        
        // Now minting NFT starts
        NftInstance.mint(msg.sender);

        //compound protocol tranfer

        uint256 mintResult = cDaiToken.mint(amount);
        require(mintResult == 0, "cDAI minting failed");

    }

    // Withdraw DAI from the Compound protocol
    function withdraw(uint256 amount) external {

// check token id widhraw done or not

//burn nft

// check -token id  amount maping 


        require(amount > 0, "Amount must be greater than zero");
        require( cDaiToken.balanceOf(address(this)) >= amount,
            "Insufficient cDAI balance"
        );
        uint256 redeemResult = cDaiToken.redeem(amount);
        require(redeemResult == 0, "cDAI redeeming failed");
        daiToken.safeTransfer(msg.sender, amount);
    }

    // Check the cDAI balance of this contract
    function cDaiBalance() external view returns (uint256) {
        return cDaiToken.balanceOf(address(this));
    }

    function DaiBalance() external view returns (uint256) {
        return daiToken.balanceOf(address(this));
    }

    // Allow the owner to withdraw Earned tokens interest
    function withdrawExcessTokens(address tokenAddress) external {
        require(msg.sender == owner, "Only the owner can call this function");
        require(tokenAddress != address(cDaiToken), "Cannot withdraw cDAI");
        IERC20 token = IERC20(tokenAddress);
        uint256 balance = token.balanceOf(address(this));
        require(balance > 0, "No balance to withdraw");
        token.safeTransfer(owner, balance);
    }
}
