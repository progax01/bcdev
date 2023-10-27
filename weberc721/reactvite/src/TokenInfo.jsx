// TokenInfo.js
import  { useState, useEffect } from 'react';
import axios from 'axios';
//import EmailInputModal from './EmailInputModal';
import { Modal, TextField, Button, Typography, Container, Box, Grid } from '@mui/material';
import { styled } from '@mui/system';

const StyledModal = styled(Modal)`
display: flex;
align-items: center;
justify-content: center;

.modal-content {
  background-color: #fff; /* Background color */
  border: 1px solid #ccc; /* Border style */
  padding: 66px; /* Padding inside the modal */
  border-radius: 8px; /* Rounded corners */
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.2); /* Box shadow for a subtle depth effect */
  text-align: center;
}
`;

function TokenInfo() {
  const [name, setName] = useState('');
  const [symbol, setSymbol] = useState('');
  const [owner, setOwner] = useState('');
 
 // const [address, setAddress] = useState('');
  const [mintAddress, setMintAddress] = useState('');
  const [mintURI, setMintURI] = useState('');

  const [userAddress, setUserAddress] = useState(''); 
  const [balance, setBalance] = useState('');  
 
  const [isEmailModalOpen, setEmailModalOpen] = useState(true);
  const [userEmail, setUserEmail] = useState('');

  const apiUrl = 'http://localhost:5000'; // Replace with your backend API URL

  const handleCloseEmailModal = () => {
    setEmailModalOpen(false);
  };

  const handleEmailInput = () => {
    handleCloseEmailModal();
    console.log(userEmail);

  };

  // Function to fetch token information
  const getTokenInfo = async () => {
    try {
      const responseName = await axios.get(`${apiUrl}/getName`);
      const responseSymbol = await axios.get(`${apiUrl}/getSymbol`);
      const responseOwner = await axios.get(`${apiUrl}/ContractOwner`);
     // const responseBalance = await axios.post(`${apiUrl}/getBalance`);
   

      setName(responseName.data.name);
      setSymbol(responseSymbol.data.symbol);
      setOwner(responseOwner.data.owner);
   // setBalance(responseBalance.data.bal);
    } catch (error) {
      console.error(error);
    }
  };

   // Function to fetch user's balance
   const getUserBalance = async () => {
    try {
      const responseBalance = await axios.get(`${apiUrl}/getBalance`, {
        params:{
          add: userAddress,
          email:userEmail
        }
       // address: userAddress,
      });

      setBalance(responseBalance.data.bal);
    } catch (error) {
      console.error(error);
    }
  };


  // Function to mint a new token
  const mintToken = async () => {
    try {
      const response = await axios.post(`${apiUrl}/mint`, {
        address: mintAddress,
        uri: mintURI,
        email:userEmail,
      });

      if (response.data.flag) {
        alert(`Token minted successfully! Tx Hash: ${response.data.message}`);
      } else {
        alert('Token minting failed.');
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getTokenInfo();
  }, []);

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Token Information
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={4}>
          <Box>
            <Typography variant="h6">Name:</Typography>
            <Typography>{name}</Typography>
          </Box>
        </Grid>
        <Grid item xs={4}>
          <Box>
            <Typography variant="h6">Symbol:</Typography>
            <Typography>{symbol}</Typography>
          </Box>
        </Grid>
        <Grid item xs={4}>
          <Box>
            <Typography variant="h6">Contract Owner:</Typography>
            <Typography>{owner}</Typography>
          </Box>
        </Grid>
      </Grid>
      <Typography variant="h4" gutterBottom container paddingTop={6}>
        Mint a New Token
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={4}>
          <TextField
            label="Recipient Address"
            variant="outlined"
            fullWidth
            value={mintAddress}
            onChange={(e) => setMintAddress(e.target.value)}
          />
        </Grid>
        <Grid item xs={4}>
          <TextField
            label="Token URI"
            variant="outlined"
            fullWidth
            value={mintURI}
            onChange={(e) => setMintURI(e.target.value)}
          />
        </Grid>
        <Grid item xs={4}>
          <Button variant="contained" color="primary" onClick={mintToken}>
            Mint Token
          </Button>
        </Grid>
      </Grid>
      <Typography variant="h4" gutterBottom container paddingTop={6}>
        Get User Balance
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={4}>
          <TextField
            label="User Address"
            variant="outlined"
            fullWidth
            value={userAddress}
            onChange={(e) => setUserAddress(e.target.value)}
          />
        </Grid>
        <Grid item xs={4}>
          <Button variant="contained" color="primary" onClick={getUserBalance}>
            Get Balance
          </Button>
        </Grid>
        <Grid item xs={4}>
          <Typography variant="h6" >User Balance:</Typography>
          <Typography>{balance}</Typography>
        </Grid>
      </Grid>

      <StyledModal open={isEmailModalOpen} onClose={handleCloseEmailModal}>
      <div className="modal-content">
        <Typography variant="h5" gutterBottom>
          Enter Your Email
        </Typography>
        <TextField
          label="Email"
          variant="outlined"
          fullWidth
          value={userEmail}
          onChange={(e) => setUserEmail(e.target.value)}
          />
          <Box mt={2}>
          <Button variant="contained" color="primary" onClick={handleEmailInput}>
            Submit
          </Button>
        </Box>
      </div>
    </StyledModal>
    </Container>
    
  );
}

export default TokenInfo;
