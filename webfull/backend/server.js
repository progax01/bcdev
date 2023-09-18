const express = require('express')
const multer = require('multer')
const cors = require('cors');
const axios = require('axios')
const app = express()
const port=process.env.PORT || 5000

app.use(express.json())

const upload = multer({
    limits:{
        fileSize:1000000
    }
})

////
// const axios = require("axios")

// const axiosInstance = axios.create({
// 	baseURL: "https://api.starton.com",
// 	headers: {
// 		"x-api-key": "PUT HERE YOUR API KEY",
// 	},
// })

// axiosInstance.post(
// 	"/v3/smart-contract/polygon-mumbai/0x189112E8912e2075fE89606a0e60E5D3991370cE/read",
// 	{
// 		functionName: "DEFAULT_ADMIN_ROLE",
// 		params: []
// 	}
// ).then((response) => {
// 	console.log(response.data)
// })

///
const starton = axios.create({
    baseURL: "https://api.starton.io/v3",
    headers: {
        "x-api-key": "sk_live_1cf89309-2408-4526-ac8a-92e83dc0a7d2",
    },
  })

  app.post('/upload',cors(),upload.single('file'),async(req,res)=>{
   
    let data = new FormData();
    const blob = new Blob([req.file.buffer],{type:req.file.mimetype});
    data.append("file",blob,{filename:req.file.originalname})
    data.append("isSync","true");

    async function uploadImageOnIpfs(){
        const ipfsImg = await starton.post("/ipfs/file", data, {
            headers: { "Content-Type": `multipart/form-data; boundary=${data._boundary}` },
          })
          return ipfsImg.data;
    }
    async function uploadMetadataOnIpfs(imgCid){
        const metadataJson = {
            name: `My owned NFT`,
            description: `My created NFT !`,
            image: `ipfs://ipfs/${imgCid}`,
        }
        const ipfsMetadata = await starton.post("/ipfs/json", {
            name: "My NFT metadata Json",
            content: metadataJson,
            isSync: true,
        })
        return ipfsMetadata.data;
    }
    
    const SMART_CONTRACT_NETWORK="polygon-mumbai"
    const SMART_CONTRACT_ADDRESS="0x189112E8912e2075fE89606a0e60E5D3991370cE"
    const WALLET_IMPORTED_ON_STARTON="0xF752bFdd8ac2b287F3481393C7001538909f13A0";
    async function mintNFT(receiverAddress,metadataCid){
        const nft = await starton.post(`/smart-contract/${SMART_CONTRACT_NETWORK}/${SMART_CONTRACT_ADDRESS}/call`, {
            functionName: "mint",
            signerWallet: WALLET_IMPORTED_ON_STARTON,
            speed: "low",
            params: [receiverAddress, metadataCid],
        })
        return nft.data;
    }
    const RECEIVER_ADDRESS = "0x5B9E995108c51457De3F6FDd9D80D71C517e244F"
    const ipfsImgData = await uploadImageOnIpfs();
    const ipfsMetadata = await uploadMetadataOnIpfs(ipfsImgData.cid);
    const nft = await mintNFT(RECEIVER_ADDRESS,ipfsMetadata.cid)
    console.log(nft)
    res.status(201).json({
        transactionHash:nft.transactionHash,
        cid:ipfsImgData.cid
    })
  })
  app.listen(port,()=>{
    console.log('Server is running on port '+ port);
  })