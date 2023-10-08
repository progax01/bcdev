// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// Mock ERC20 Token
contract ERC20 {
    string public name = "MockToken";
    string public symbol = "MTK";
    uint8 public decimals = 18;
    uint256 public totalSupply = 1000000 * 10**18; // 1 million tokens
    mapping(address => uint256) public balanceOf;
    mapping(address => mapping(address => uint256)) public allowance;

    constructor() {
        balanceOf[msg.sender] = totalSupply;
    }

    function approve(address spender, uint256 amount) external returns (bool) {
        allowance[msg.sender][spender] = amount;
        return true;
    }

    function transfer(address to, uint256 amount) external returns (bool) {
        require(to != address(0), "Invalid address");
        require(balanceOf[msg.sender] >= amount, "Insufficient balance");
        balanceOf[msg.sender] -= amount;
        balanceOf[to] += amount;
        return true;
    }

    function transferFrom(address from, address to, uint256 amount) external returns (bool) {
        require(to != address(0), "Invalid address");
        require(balanceOf[from] >= amount, "Insufficient balance");
        require(allowance[from][msg.sender] >= amount, "Allowance exceeded");
        balanceOf[from] -= amount;
        balanceOf[to] += amount;
        allowance[from][msg.sender] -= amount;
        return true;
    }
}

contract UniswapV3Mock {
    ERC20 public token;
    address public owner;
    uint256 public liquidity;

    constructor(address _token) {
        token = ERC20(_token);
        owner = msg.sender;
    }

    function addLiquidity(uint256 amountTokenDesired, uint256 amountTokenMin, uint256 amountETHMin, address to, uint256 deadline)
        external
        returns (uint256 amountToken, uint256 amountETH, uint256 _liquidity)
    {
        require(to != address(0), "Invalid address");
        require(deadline >= block.timestamp, "Deadline has passed");

        // Simplified logic for adding liquidity
        // Transfer tokens from the caller to this contract
        token.transferFrom(msg.sender, address(this), amountTokenDesired);
        // Transfer ETH from the caller to this contract
        payable(address(this)).transfer(msg.value);

        // Mint liquidity tokens (this is a simplified representation)
        _liquidity = amountTokenDesired; // In practice, you'd calculate this based on the pool's formula

        // Emit an event to track the liquidity added
        emit LiquidityAdded(msg.sender, amountTokenDesired, msg.value, _liquidity);
        
        liquidity += _liquidity;
        return (amountTokenDesired, msg.value, _liquidity);
    }

    function removeLiquidity(uint256 _liquidity, uint256 amountTokenMin, uint256 amountETHMin, address to, uint256 deadline)
        external
        returns (uint256 amountToken, uint256 amountETH)
    {
        require(to != address(0), "Invalid address");
        require(deadline >= block.timestamp, "Deadline has passed");

        // Simplified logic for removing liquidity
        // Calculate the amount of tokens and ETH to return
        amountToken = _liquidity;
        amountETH = _liquidity; // In practice, you'd calculate this based on the pool's formula

        // Transfer tokens and ETH to the caller
        token.transfer(to, amountToken);
        payable(to).transfer(amountETH);

        // Emit an event to track the liquidity removal
        emit LiquidityRemoved(to, amountToken, amountETH, _liquidity);
        
        liquidity -= _liquidity;
        return (amountToken, amountETH);
    }

    event LiquidityAdded(address indexed provider, uint256 amountToken, uint256 amountETH, uint256 liquidity);
    event LiquidityRemoved(address indexed provider, uint256 amountToken, uint256 amountETH, uint256 liquidity);
}
