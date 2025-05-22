// src/components/Layout/Header.js
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Flex,
  Heading,
  Button,
  Text,
  HStack,
  useColorModeValue,
  Avatar,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider
} from '@chakra-ui/react';
import { ChevronDownIcon } from '@chakra-ui/icons';
import { logout } from '../../store/slices/authSlice';

const Header = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const bg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <Box bg={bg} borderBottom="1px" borderColor={borderColor} shadow="sm">
      <Flex
        maxW="7xl"
        mx="auto"
        px={4}
        py={4}
        align="center"
        justify="space-between"
      >
        <Heading size="lg" color="teal.500">
          Project Cost Tracker
        </Heading>

        <HStack spacing={4}>
          <Text fontSize="sm" color="gray.600">
            Welcome back!
          </Text>
          
          <Menu>
            <MenuButton
              as={Button}
              rightIcon={<ChevronDownIcon />}
              variant="ghost"
              size="sm"
            >
              <HStack spacing={2}>
                <Avatar size="sm" name={user?.email} />
                <Text fontSize="sm">{user?.email}</Text>
              </HStack>
            </MenuButton>
            <MenuList>
              <MenuItem fontSize="sm">{user?.email}</MenuItem>
              <MenuDivider />
              <MenuItem onClick={handleLogout} color="red.500">
                Sign Out
              </MenuItem>
            </MenuList>
          </Menu>
        </HStack>
      </Flex>
    </Box>
  );
};

export default Header;