// src/pages/DashboardPage.js
import React from 'react';
import Sidebar from '../component/Sidebar';
//import Navbar from '../components/Navbar';
import styled from 'styled-components';
import Navbar from '../component/Navbar';

const DashboardContainer = styled.div`
  display: flex;
  padding-top: 64px; /* Adjust for the navbar height */
`;

const Content = styled.div`
  flex-grow: 1;
  padding: 20px;
`;

const DashboardPage = () => {
  return (
    <DashboardContainer>
    <Navbar/>
      <Sidebar />
      <Content>
        {/* Your dashboard content goes here */}
        <h1>Welcome to the Dashboard</h1>
      </Content>
    </DashboardContainer>
  );
};

export default DashboardPage;