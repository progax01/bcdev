import React from 'react';
import styled from 'styled-components';
import MyForm from './MyForm';
import Layout from '../component/Layout';

const DashboardContainer = styled.div`
  padding-top: 10px; /* Adjust for the navbar height */
`;

const DashboardPage = () => {
  return (
    <Layout>
      <DashboardContainer>
        {/* Your dashboard content goes here */}
        <h1>Complete your KYC</h1>
        <MyForm />
      </DashboardContainer>
    </Layout>
  );
};

export default DashboardPage;