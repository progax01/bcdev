// src/pages/DashboardPage.js
import React from 'react';
import Sidebar from '../component/Sidebar';
//import Navbar from '../components/Navbar';
import styled from 'styled-components';
import Navbar from '../component/Navbar';

import MyForm from './MyForm';

const DashboardContainer = styled.div`
  display: flex;
  padding-top: 120px; /* Adjust for the navbar height */
`;

const Content = styled.div`
  flex-grow: 1;
  padding: 40px;
`;

const DashboardPage = () => {
  return (
    <DashboardContainer>
    <Navbar/>
      <Sidebar />
     
        {/* Your dashboard content goes here */}
      <h1> </h1>
    <MyForm/>
      
    </DashboardContainer>
  );
};

export default DashboardPage;
