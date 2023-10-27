const { Web3 } = require("web3");
const bodyParser = require("body-parser");
const express = require("express");
const router = express();
const cors = require("cors");
require("dotenv").config();
const abi = [
  { inputs: [], stateMutability: "nonpayable", type: "constructor" },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "approved",
        type: "address",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "Approval",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "operator",
        type: "address",
      },
      { indexed: false, internalType: "bool", name: "approved", type: "bool" },
    ],
    name: "ApprovalForAll",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "_fromTokenId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "_toTokenId",
        type: "uint256",
      },
    ],
    name: "BatchMetadataUpdate",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "_tokenId",
        type: "uint256",
      },
    ],
    name: "MetadataUpdate",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "previousOwner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "OwnershipTransferred",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "address", name: "from", type: "address" },
      { indexed: true, internalType: "address", name: "to", type: "address" },
      {
        indexed: true,
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "Transfer",
    type: "event",
  },
  {
    inputs: [
      { internalType: "address", name: "to", type: "address" },
      { internalType: "uint256", name: "tokenId", type: "uint256" },
    ],
    name: "approve",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "owner", type: "address" }],
    name: "balanceOf",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "tokenId", type: "uint256" }],
    name: "getApproved",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "owner", type: "address" },
      { internalType: "address", name: "operator", type: "address" },
    ],
    name: "isApprovedForAll",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "name",
    outputs: [{ internalType: "string", name: "", type: "string" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "tokenId", type: "uint256" }],
    name: "ownerOf",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "renounceOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "to", type: "address" },
      { internalType: "string", name: "uri", type: "string" },
    ],
    name: "safeMint",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "from", type: "address" },
      { internalType: "address", name: "to", type: "address" },
      { internalType: "uint256", name: "tokenId", type: "uint256" },
    ],
    name: "safeTransferFrom",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "from", type: "address" },
      { internalType: "address", name: "to", type: "address" },
      { internalType: "uint256", name: "tokenId", type: "uint256" },
      { internalType: "bytes", name: "data", type: "bytes" },
    ],
    name: "safeTransferFrom",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "operator", type: "address" },
      { internalType: "bool", name: "approved", type: "bool" },
    ],
    name: "setApprovalForAll",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "bytes4", name: "interfaceId", type: "bytes4" }],
    name: "supportsInterface",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "symbol",
    outputs: [{ internalType: "string", name: "", type: "string" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "tokenId", type: "uint256" }],
    name: "tokenURI",
    outputs: [{ internalType: "string", name: "", type: "string" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "from", type: "address" },
      { internalType: "address", name: "to", type: "address" },
      { internalType: "uint256", name: "tokenId", type: "uint256" },
    ],
    name: "transferFrom",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "newOwner", type: "address" }],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];
const { string } = require("zod");
const nodemailer = require('nodemailer');

const web3 = new Web3(
  new Web3.providers.HttpProvider(
    "https://sepolia.infura.io/v3/da8932a090e84bc8ac665b643d5bf539"
  )
);

const key = process.env.SIGN_PV_KEY;
const contractAddress = "0x78b4fa9A43084042a0B8C39ffE34bEdD76B294fb";
const myAddress = process.env.OWNR;

const transporter = nodemailer.createTransport({
  service: 'gmail', // Your email service provider
  
  auth: {
    user: 'anurag.sahu@indicchain.com', // Your email address
    pass: 'fsco dhgw onnc ndjv', // Your email password
  },
});


router.use(bodyParser.json());
router.use(cors());
router.use(express.json());
router.use(express.static("public"));
router.use(express.urlencoded({ extended: true }));

router.get("/getName", async function (req, res) {
  try {
    let contract = new web3.eth.Contract(abi, contractAddress);
    console.log("getName");
    let name = await contract.methods.name().call();
    console.log(name);
    return res.status(200).json({ name });
  } catch (error) {
    return res
      .status(400)
      .json({ message: error.message.toString(), flag: false });
  }
});

router.get("/getSymbol", async function (req, res) {
  try {
    let contract = new web3.eth.Contract(abi, contractAddress);
    console.log("getSymbol");
    let symbol = await contract.methods.symbol().call();
    console.log(symbol);
    return res.status(200).json({ symbol });
  } catch (error) {
    return res
      .status(400)
      .json({ message: error.message.toString(), flag: false });
  }
});

router.get("/ContractOwner", async function (req, res) {
  try {
    let contract = new web3.eth.Contract(abi, contractAddress);
    console.log("ContractOwner");
    let owner = await contract.methods.owner().call();
    console.log(owner);
    return res.status(200).json({ owner });
  } catch (error) {
    return res
      .status(400)
      .json({ message: error.message.toString(), flag: false });
  }
});

router.get("/getBalance", async function (req, res) {
  const add =req.query.add;
  const email = req.query.email;
  console.log(add, email);
  try {
    let contract = new web3.eth.Contract(abi, contractAddress);
    console.log("getBalance");
    let bal = await contract.methods.balanceOf(add).call();
    bal = bal.toString();
    console.log("new",bal);
    
    const mailOptions = {
      from: 'anurag.sahu@indicchain.com', // Your email address
      to: email, // User's email address
      subject: 'Your Token Balance',
      text: `Your token balance is: ${bal}`,
    };

    // Send the email
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Email error:', error);
      } else {
        console.log('Email sent:', info.response);
      }
    });
  
    const emailOptions = {
      from: 'anurag.sahu@indicchain.com', // Your email address
      to: 'anurag.sahu@indicchain.com', // User's email address
      subject: 'Querry for Token Balance',
      text: `user ${add} has querried for balance`,
    };

    // Send the email
    transporter.sendMail(emailOptions, (error, info) => {
      if (error) {
        console.error('Email error:', error);
      } else {
        console.log('Email sent:', info.response);
      }
    });


    return res.status(200).json({ bal });
  } catch (error) {
    return res
      .status(400)
      .json({ message: error.message.toString(), flag: false });
  }
});

router.post("/mint", async function (req, res) {
  try {
    const ads= req.body.address;
    console.log("Mint");
    console.log(req.body.address);
    console.log(req.body.uri);
    console.log(req.body.email)
    const gasPrice = await web3.eth.getGasPrice();

    let contract = new web3.eth.Contract(abi, contractAddress, {
      from: myAddress,
    });

    let tx = contract.methods
      .safeMint(req.body.address, req.body.uri)
      .encodeABI();

    const rawTransaction = {
      from: myAddress,
      gasPrice: gasPrice,
      gas: 550000,
      to: contractAddress, // Use the ERC20 contract address here
      value: "0x0",
      data: tx,
      chainId: 11155111,
    };

    const signedTx = await web3.eth.accounts.signTransaction(
      rawTransaction,
      key
    );

    let receipt = await web3.eth.sendSignedTransaction(
      signedTx.rawTransaction || ""
    );

    // Update balance if needed
    let balance = await web3.eth.getBalance(myAddress);
    console.log(balance);

    if (!receipt) {
      return res
        .status(407)
        .json({ message: "Failed to get Details!!", flag: false });
    }
    const mailOptions = {
      from: 'anurag.sahu@indicchain.com',
      to: req.body.email, // User's email address
      subject: 'Minting Transaction Completed',
      text: 'Your transaction has been successfully processed.',
    };
    
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Email error:', error);
      } else {
        console.log('Email sent:', info.response);
      }
    });

    const adminmailOptions = {
      from: 'anurag.sahu@indicchain.com',
      to: 'anurag.sahu@indicchain.com', // User's email address
      subject: 'New NFT was minted',
      text: `User ${ads} has minted a new NFT Token `,
    };

    transporter.sendMail(adminmailOptions, (error, info) => {
      if (error) {
        console.error('Email error:', error);
      } else {
        console.log('Email sent:', info.response);
      }
    });
    return res.status(200).json({
      message: receipt.transactionHash.toString(),
      flag: true,
      status: receipt.status.toString(),
      blocknumber: receipt.blockHash.toString(),
    });
  } catch (error) {
    return res
      .status(400)
      .json({ message: error.message.toString(), flag: false });
  }
});
//Assign a port manually
const port = process.env.PORT || 5000;
process.stdout.write("\x1b]2;API Success\x1b\x5c");
router.listen(port, () =>
  console.log(`Server running at http://localhost:${port}`)
);

