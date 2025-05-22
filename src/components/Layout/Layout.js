// src/components/Layout/Layout.js
import React from 'react';
import { Box, Container } from '@chakra-ui/react';
import Header from './Header';

const Layout = ({ children }) => {
  return (
    <Box minH="100vh" bg="gray.50">
      <Header />
      <Container maxW="7xl" py={8}>
        {children}
      </Container>
    </Box>
  );
};

export default Layout;