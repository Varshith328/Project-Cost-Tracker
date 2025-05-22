// src/components/Auth/SignUp.js
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Text,
  Alert,
  AlertIcon,
  Heading,
  Card,
  CardBody,
  useColorModeValue
} from '@chakra-ui/react';
import { signUp, clearError } from '../../store/slices/authSlice';

const SignUp = ({ onToggleMode }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');

  const dispatch = useDispatch();
  const { isLoading, error } = useSelector((state) => state.auth);

  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  const validateForm = () => {
    let isValid = true;
    setEmailError('');
    setPasswordError('');
    setConfirmPasswordError('');

    if (!email) {
      setEmailError('Email is required');
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError('Email is invalid');
      isValid = false;
    }

    if (!password) {
      setPasswordError('Password is required');
      isValid = false;
    } else if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      isValid = false;
    }

    if (!confirmPassword) {
      setConfirmPasswordError('Please confirm your password');
      isValid = false;
    } else if (password !== confirmPassword) {
      setConfirmPasswordError('Passwords do not match');
      isValid = false;
    }

    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      await dispatch(signUp({ email, password })).unwrap();
    } catch (error) {
      console.error('Signup failed:', error);
    }
  };

  return (
    <Box
      minH="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      bg={useColorModeValue('gray.50', 'gray.900')}
      p={4}
    >
      <Card
        maxW="md"
        w="full"
        bg={bgColor}
        borderColor={borderColor}
        borderWidth="1px"
      >
        <CardBody>
          <VStack spacing={6}>
            <Heading size="lg" textAlign="center" color="teal.500">
              Create Account
            </Heading>
            <Text textAlign="center" color="gray.600">
              Sign up to start tracking your project costs
            </Text>

            {error && (
              <Alert status="error" borderRadius="md">
                <AlertIcon />
                {error}
              </Alert>
            )}

            <Box as="form" w="full" onSubmit={handleSubmit}>
              <VStack spacing={4}>
                <FormControl isInvalid={emailError}>
                  <FormLabel>Email</FormLabel>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    focusBorderColor="teal.500"
                  />
                  {emailError && (
                    <Text color="red.500" fontSize="sm" mt={1}>
                      {emailError}
                    </Text>
                  )}
                </FormControl>

                <FormControl isInvalid={passwordError}>
                  <FormLabel>Password</FormLabel>
                  <Input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    focusBorderColor="teal.500"
                  />
                  {passwordError && (
                    <Text color="red.500" fontSize="sm" mt={1}>
                      {passwordError}
                    </Text>
                  )}
                </FormControl>

                <FormControl isInvalid={confirmPasswordError}>
                  <FormLabel>Confirm Password</FormLabel>
                  <Input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm your password"
                    focusBorderColor="teal.500"
                  />
                  {confirmPasswordError && (
                    <Text color="red.500" fontSize="sm" mt={1}>
                      {confirmPasswordError}
                    </Text>
                  )}
                </FormControl>

                <Button
                  type="submit"
                  colorScheme="teal"
                  size="lg"
                  w="full"
                  isLoading={isLoading}
                  loadingText="Creating account..."
                >
                  Sign Up
                </Button>
              </VStack>
            </Box>

            <Text textAlign="center">
              Already have an account?{' '}
              <Text
                as="span"
                color="teal.500"
                cursor="pointer"
                textDecoration="underline"
                onClick={onToggleMode}
              >
                Sign in here
              </Text>
            </Text>
          </VStack>
        </CardBody>
      </Card>
    </Box>
  );
};

export default SignUp;