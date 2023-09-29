// SPDX-License-Identifier: MIT

pragma solidity ^0.8.6;



// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./IERC20.sol"; // Import the ERC20 interface
import "./Comptroller.sol"; // Import the Compound Comptroller contract
import "./CToken.sol"; // Import the cToken contract

contract CompoundInteraction {
    Comptroller public comptroller;
    CToken public cToken;
    IERC20 public underlyingToken;

    constructor(address _comptrollerAddress, address _cTokenAddress, address _underlyingTokenAddress) {
        comptroller = Comptroller(_comptrollerAddress);
        cToken = CToken(_cTokenAddress);
        underlyingToken = IERC20(_underlyingTokenAddress);
    }

    function supplyToCompound(uint256 amount) external {
        // Approve the transfer of your ERC20 tokens to the cToken contract
        require(underlyingToken.approve(address(cToken), amount), "Approval failed");

        // Supply tokens to Compound
        require(cToken.mint(amount) == 0, "Minting failed");
    }

    function calculateInterestEarned(address user) external view returns (uint256) {
        // Get the user's balance in cTokens
        uint256 cTokenBalance = cToken.balanceOf(user);

        // Get the exchange rate (how many underlying tokens you get per cToken)
        uint256 exchangeRate = cToken.exchangeRateStored();

        // Calculate the user's balance in underlying tokens
        uint256 underlyingBalance = cTokenBalance * exchangeRate / 1e18;

        // Calculate the interest earned (balance in underlying tokens - supplied amount)
        uint256 suppliedAmount = underlyingBalance - cTokenBalance;
        return suppliedAmount;
    }

    function withdrawWithInterest(uint256 amount) external {
        // Calculate the equivalent amount of cTokens to withdraw
        uint256 cTokenAmount = amount * 1e18 / cToken.exchangeRateStored();

        // Withdraw cTokens
        require(cToken.redeem(cTokenAmount) == 0, "Redeem failed");

        // Transfer the underlying tokens to the user
        require(underlyingToken.transfer(msg.sender, amount), "Transfer failed");
    }
}


interface Erc20 {
    function approve(address, uint256) external returns (bool);

    function transfer(address, uint256) external returns (bool);
}


interface CErc20 {
    function mint(uint256) external returns (uint256);

    function exchangeRateCurrent() external returns (uint256);

    function supplyRatePerBlock() external returns (uint256);

    function redeem(uint) external returns (uint);

    function redeemUnderlying(uint) external returns (uint);
}


interface CEth {
    function mint() external payable;

    function exchangeRateCurrent() external returns (uint256);

    function supplyRatePerBlock() external returns (uint256);

    function redeem(uint) external returns (uint);

    function redeemUnderlying(uint) external returns (uint);
}


contract MyContract {
    event MyLog(string, uint256);

    function supplyEthToCompound(address payable _cEtherContract)
        public
        payable
        returns (bool)
    {
        // Create a reference to the corresponding cToken contract
        CEth cToken = CEth(_cEtherContract);

        // Amount of current exchange rate from cToken to underlying
        uint256 exchangeRateMantissa = cToken.exchangeRateCurrent();
        emit MyLog("Exchange Rate (scaled up by 1e18): ", exchangeRateMantissa);

        // Amount added to you supply balance this block
        uint256 supplyRateMantissa = cToken.supplyRatePerBlock();
        emit MyLog("Supply Rate: (scaled up by 1e18)", supplyRateMantissa);

        cToken.mint{ value: msg.value, gas: 250000 }();
        return true;
    }

    function supplyErc20ToCompound(
        address _erc20Contract,
        address _cErc20Contract,
        uint256 _numTokensToSupply
    ) public returns (uint) {
        // Create a reference to the underlying asset contract, like DAI.
        Erc20 underlying = Erc20(_erc20Contract);

        // Create a reference to the corresponding cToken contract, like cDAI
        CErc20 cToken = CErc20(_cErc20Contract);

        // Amount of current exchange rate from cToken to underlying
        uint256 exchangeRateMantissa = cToken.exchangeRateCurrent();
        emit MyLog("Exchange Rate (scaled up): ", exchangeRateMantissa);

        // Amount added to you supply balance this block
        uint256 supplyRateMantissa = cToken.supplyRatePerBlock();
        emit MyLog("Supply Rate: (scaled up)", supplyRateMantissa);

        // Approve transfer on the ERC20 contract
        underlying.approve(_cErc20Contract, _numTokensToSupply);

        // Mint cTokens
        uint mintResult = cToken.mint(_numTokensToSupply);
        return mintResult;
    }

    function redeemCErc20Tokens(
        uint256 amount,
        bool redeemType,
        address _cErc20Contract
    ) public returns (bool) {
        // Create a reference to the corresponding cToken contract, like cDAI
        CErc20 cToken = CErc20(_cErc20Contract);

        // `amount` is scaled up, see decimal table here:
        // https://compound.finance/docs#protocol-math

        uint256 redeemResult;

        if (redeemType == true) {
            // Retrieve your asset based on a cToken amount
            redeemResult = cToken.redeem(amount);
        } else {
            // Retrieve your asset based on an amount of the asset
            redeemResult = cToken.redeemUnderlying(amount);
        }

        // Error codes are listed here:
        // https://compound.finance/docs/ctokens#error-codes
        emit MyLog("If this is not 0, there was an error", redeemResult);

        return true;
    }

    function redeemCEth(
        uint256 amount,
        bool redeemType,
        address _cEtherContract
    ) public returns (bool) {
        // Create a reference to the corresponding cToken contract
        CEth cToken = CEth(_cEtherContract);

        // `amount` is scaled up by 1e18 to avoid decimals

        uint256 redeemResult;

        if (redeemType == true) {
            // Retrieve your asset based on a cToken amount
            redeemResult = cToken.redeem(amount);
        } else {
            // Retrieve your asset based on an amount of the asset
            redeemResult = cToken.redeemUnderlying(amount);
        }

        // Error codes are listed here:
        // https://compound.finance/docs/ctokens#error-codes
        emit MyLog("If this is not 0, there was an error", redeemResult);

        return true;
    }

    // This is needed to receive ETH when calling `redeemCEth`
    receive() external payable {}
}