// src/App.js
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ChakraProvider, Box, Spinner, Flex } from '@chakra-ui/react';
import { checkAuthState } from './store/slices/authSlice';
import Login from './components/Auth/Login';
import SignUp from './components/Auth/SignUp';
import Layout from './components/Layout/Layout';
import Dashboard from './components/Dashboard/Dashboard';

function App() {
  const [isLogin, setIsLogin] = useState(true);
  const [isInitializing, setIsInitializing] = useState(true);
  
  const dispatch = useDispatch();
  const { isAuthenticated, isLoading } = useSelector((state) => state.auth);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        await dispatch(checkAuthState());
      } catch (error) {
        console.error('Auth initialization error:', error);
      } finally {
        setIsInitializing(false);
      }
    };

    initializeAuth();
  }, [dispatch]);

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
  };

  // Show loading spinner during initialization
  if (isInitializing || isLoading) {
    return (
      <ChakraProvider>
        <Flex
          minH="100vh"
          align="center"
          justify="center"
          bg="gray.50"
        >
          <Spinner size="xl" color="teal.500" thickness="4px" />
        </Flex>
      </ChakraProvider>
    );
  }

  return (
    <ChakraProvider>
      {!isAuthenticated ? (
        <Box>
          {isLogin ? (
            <Login onToggleMode={toggleAuthMode} />
          ) : (
            <SignUp onToggleMode={toggleAuthMode} />
          )}
        </Box>
      ) : (
        <Layout>
          <Dashboard />
        </Layout>
      )}
    </ChakraProvider>
  );
}

export default App;
