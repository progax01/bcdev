require('dotenv').config()

import { create } from '@pinata/sdk';

const pinata = create({ apiKey:'150fd332522a2059091e',secretApiKey: '48561d53acf2aa2f1a8ea59b0317bb823f0d07d5791d1971bf7196e4c9db5263' });

const  uploadImage = async (imageFile) =>{
    const fileBuffer = Buffer.from( await imageFile.arrayBuffer());
    console.log(pinata);
    const options = {
        pinataMetadata: {
            name: 'kyc-image', // Set a name for the image
        },
    };

    try {
        const result = await pinata.pinFileToIPFS(fileBuffer, options);
        console.log('ipfshs',IpfsHash)
        return result.IpfsHash;
    } catch (error) {
        console.error('Error uploading image to Pinata:', error);
        throw error;
    }
}
export default uploadImage;