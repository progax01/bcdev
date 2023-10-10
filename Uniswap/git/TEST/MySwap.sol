// SPDX-License-Identifier: GPL-2.0-or-later

// 0xe81A053dBC20Bd60237594d77013E5a22d9F23B4 DEPLOYED ADDRESS

pragma solidity ^0.7.6;
pragma abicoder v2;

import "@uniswap/v3-periphery/contracts/interfaces/ISwapRouter.sol";

interface IERC20 {
    function balanceOf(address account) external view returns (uint256);

    function transfer(address recipient, uint256 amount)
        external
        returns (bool);

    function approve(address spender, uint256 amount) external returns (bool);
}

contract SingleSwap {
    address public constant routerAddress =
        0xE592427A0AEce92De3Edee1F18E0157C05861564;
    ISwapRouter public immutable swapRouter = ISwapRouter(routerAddress);

    address public constant LINK = 0x326C977E6efc84E512bB9C30f76E30c160eD06FB;
    address public constant WETH = 0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6;

    IERC20 public linkToken = IERC20(LINK);

    // For this example, we will set the pool fee to 0.3%.
    uint24 public constant poolFee = 3000;

    constructor() {}

    function swapExactInputSingle(uint256 amountIn)
        external
        returns (uint256 amountOut)
    {
        linkToken.approve(address(swapRouter), amountIn);

        ISwapRouter.ExactInputSingleParams memory params = ISwapRouter
            .ExactInputSingleParams({
                tokenIn: LINK,
                tokenOut: WETH,
                fee: poolFee,
                recipient: address(this),
                deadline: block.timestamp,
                amountIn: amountIn,
                amountOutMinimum: 0,
                sqrtPriceLimitX96: 0
            });

        amountOut = swapRouter.exactInputSingle(params);
    }

    function swapExactOutputSingle(uint256 amountOut, uint256 amountInMaximum)
        external
        returns (uint256 amountIn)
    {
        linkToken.approve(address(swapRouter), amountInMaximum);

        ISwapRouter.ExactOutputSingleParams memory params = ISwapRouter
            .ExactOutputSingleParams({
                tokenIn: LINK,
                tokenOut: WETH,
                fee: poolFee,
                recipient: address(this),
                deadline: block.timestamp,
                amountOut: amountOut,
                amountInMaximum: amountInMaximum,
                sqrtPriceLimitX96: 0
            });

        amountIn = swapRouter.exactOutputSingle(params);

        if (amountIn < amountInMaximum) {
            linkToken.approve(address(swapRouter), 0);
            linkToken.transfer(address(this), amountInMaximum - amountIn);
        }
    }

    function swapEthToToken(address tokenOut, uint256 amountOutMinimum)
        external
        payable
        returns (uint256 amountOut)
    {
        ISwapRouter.ExactInputSingleParams memory params = ISwapRouter
            .ExactInputSingleParams({
                tokenIn: WETH,  // WETH is Goerli ETH
                tokenOut: tokenOut,
                fee: poolFee,
                recipient: msg.sender,
                deadline: block.timestamp,
                amountIn: msg.value,
                amountOutMinimum: amountOutMinimum,
                sqrtPriceLimitX96: 0
            });

        amountOut = swapRouter.exactInputSingle{value: msg.value}(params);
    }

    function swapTokenToEth(address tokenIn, uint256 amountIn, uint256 amountOutMinimum)
    external
    returns (uint256 amountOut)
{
    // Approve the transfer of the token to the router
    IERC20(tokenIn).approve(address(swapRouter), amountIn);

    ISwapRouter.ExactInputSingleParams memory params = ISwapRouter
        .ExactInputSingleParams({
            tokenIn: tokenIn,
            tokenOut: WETH,  // WETH is Goerli ETH
            fee: poolFee,
            recipient: msg.sender,
            deadline: block.timestamp,
            amountIn: amountIn,
            amountOutMinimum: amountOutMinimum,
            sqrtPriceLimitX96: 0
        });

    amountOut = swapRouter.exactInputSingle(params);
}

function swapTokenToToken(address tokenIn, address tokenOut, uint256 amountIn, uint256 amountOutMinimum)
    external
    returns (uint256 amountOut)
{
    // Approve the transfer of the input token to the router
    IERC20(tokenIn).approve(address(swapRouter), amountIn);

    ISwapRouter.ExactInputSingleParams memory params = ISwapRouter
        .ExactInputSingleParams({
            tokenIn: tokenIn,
            tokenOut: tokenOut,
            fee: poolFee,
            recipient: msg.sender,
            deadline: block.timestamp,
            amountIn: amountIn,
            amountOutMinimum: amountOutMinimum,
            sqrtPriceLimitX96: 0
        });

    amountOut = swapRouter.exactInputSingle(params);
}


    function CheckBalance(address ads) public view returns(uint){
        uint bal= linkToken.balanceOf(ads);
        return bal;
    }
}
