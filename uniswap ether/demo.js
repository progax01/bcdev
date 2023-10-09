const {ethers}= require("ethers")
const {Pool}= require ("@uniswap/v3-sdk");
const poolAddress= "0x8ad599c3A0ff1De082011EFDDc58f1908eb6e6D8" ;
const  UniswapV3Pool = require("@uniswap/v3-core/artifacts/contracts/interfaces/IUniswapV3Pool.sol/IUniswapV3Pool.json");
const provider = new ethers.providers.JsonRpcProvider("https://mainnet.infura.io/v3/da8932a090e84bc8ac665b643d5bf539");

poolContract= new ethers.Contract(poolAddress, UniswapV3Pool.abi , provider);

async function main () {
    const pool = new Pool (
        token0,
        token1,
        poolFee,
        poolPrice,
        poolLiquidity,
        poolTick,
        tickList
    );
}