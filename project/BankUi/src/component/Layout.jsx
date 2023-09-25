
import React from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import styled from 'styled-components';

const LayoutContainer = styled.div`
  display: flex;
`;

const Content = styled.div`
  flex-grow: 1;
  padding: 20px;
`;

const Layout = ({ children }) => {
  return (
    <LayoutContainer>
      <Sidebar />
      <Content>
        <Navbar />
        {children}
      </Content>
    </LayoutContainer>
  );
};

export default Layout;
