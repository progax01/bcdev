 
const {Pool}= require ("@uniswap/v3-sdk");
const { ethers } = require('ethers');
const  UniswapV3Pool = require("@uniswap/v3-core/artifacts/contracts/interfaces/IUniswapV3Pool.sol/IUniswapV3Pool.json");
const { Token }= require("@uniswap/sdk-core");

const provider = new JsonRpcProvider("https://mainnet.infura.io/v3/da8932a090e84bc8ac665b643d5bf539");

const poolAddress= "0x8ad599c3A0ff1De082011EFDDc58f1908eb6e6D8" ;

poolContract= new ethers.Contract(poolAddress, UniswapV3Pool.abi , provider);

async function main () {
    const usdcAddress="0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";
    const wethAddress = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2";
    const token0 = new Token(1 ,usdcAddress, 6, "USDC", "USD Coin" );
    const token1 = new Token(1 ,wethAddress, 18, "WETH", "Wrapped Ether");
    
    const poolFee = await poolContract.fee();
    const slot0= await poolContract.slot0();
    console.log(slot0);
    //const poolLiquidity = await poolContract.liquidity();

    // const pool = new Pool (
    //     token0,
    //     token1,
    //     poolFee,
    //     slot0[0],
    //     poolLiquidity,
    //     poolTick,
    //     tickList
    // );
}

main(); 