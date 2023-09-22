// src/components/Navbar.js
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { AppBar, Toolbar, Typography } from '@mui/material';

const Navbar = () => {
  return (
    <AppBar position="fixed"  sx={{ width: `calc(100% -20% )` }}>
      <Toolbar>
        <Typography variant="h6">Dashboard</Typography>
        {/* Add additional elements like buttons or user profile here */}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
