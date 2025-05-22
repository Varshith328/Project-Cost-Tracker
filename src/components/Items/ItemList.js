// src/components/Items/ItemList.js
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import {
  Box,
  VStack,
  HStack,
  Text,
  Button,
  Heading,
  useDisclosure,
  Spinner,
  Alert,
  AlertIcon,
  Badge,
  Flex
} from '@chakra-ui/react';
import { AddIcon } from '@chakra-ui/icons';
import ItemCard from './ItemCard';
import ItemForm from './ItemForm';
import { selectItems, selectItemsLoading, selectItemsError, selectItemsTotal } from '../../store/slices/itemsSlice';

const ItemList = () => {
  const [selectedItem, setSelectedItem] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  
  const items = useSelector(selectItems);
  const isLoading = useSelector(selectItemsLoading);
  const error = useSelector(selectItemsError);
  const totalCost = useSelector(selectItemsTotal);

  const handleAddItem = () => {
    setSelectedItem(null);
    onOpen();
  };

  const handleEditItem = (item) => {
    setSelectedItem(item);
    onOpen();
  };

  const handleCloseForm = () => {
    setSelectedItem(null);
    onClose();
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  if (error) {
    return (
      <Alert status="error" borderRadius="md">
        <AlertIcon />
        Error loading items: {error}
      </Alert>
    );
  }

  return (
    <Box>
      <Flex justify="space-between" align="center" mb={6}>
        <Box>
          <Heading size="lg" mb={2}>Items</Heading>
          <HStack spacing={4}>
            <Text color="gray.600">
              {items.length} {items.length === 1 ? 'item' : 'items'}
            </Text>
            <Badge colorScheme="blue" variant="subtle" fontSize="sm" px={2} py={1}>
              Total: {formatCurrency(totalCost)}
            </Badge>
          </HStack>
        </Box>
        
        <Button
          leftIcon={<AddIcon />}
          colorScheme="teal"
          onClick={handleAddItem}
        >
          Add Item
        </Button>
      </Flex>

      {isLoading && (
        <Flex justify="center" py={8}>
          <Spinner size="lg" color="teal.500" />
        </Flex>
      )}

      {!isLoading && items.length === 0 && (
        <Box
          textAlign="center"
          py={12}
          bg="gray.50"
          borderRadius="lg"
          border="2px dashed"
          borderColor="gray.200"
        >
          <Text fontSize="lg" color="gray.500" mb={4}>
            No items added yet
          </Text>
          <Text color="gray.400" mb={6}>
            Start by adding your project items like hardware, software, or services
          </Text>
          <Button
            leftIcon={<AddIcon />}
            colorScheme="teal"
            onClick={handleAddItem}
          >
            Add Your First Item
          </Button>
        </Box>
      )}

      {!isLoading && items.length > 0 && (
        <VStack spacing={4} align="stretch">
          {items.map((item) => (
            <ItemCard
              key={item.id}
              item={item}
              onEdit={handleEditItem}
            />
          ))}
        </VStack>
      )}

      <ItemForm
        isOpen={isOpen}
        onClose={handleCloseForm}
        item={selectedItem}
      />
    </Box>
  );
};

export default ItemList;