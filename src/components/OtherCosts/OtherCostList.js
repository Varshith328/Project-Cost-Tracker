// src/components/OtherCosts/OtherCostList.js
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
import OtherCostCard from './OtherCostCard';
import OtherCostForm from './OtherCostForm';
import { selectOtherCosts, selectOtherCostsLoading, selectOtherCostsError, selectOtherCostsTotal } from '../../store/slices/otherCostsSlice';

const OtherCostList = () => {
  const [selectedOtherCost, setSelectedOtherCost] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  
  const otherCosts = useSelector(selectOtherCosts);
  const isLoading = useSelector(selectOtherCostsLoading);
  const error = useSelector(selectOtherCostsError);
  const totalAmount = useSelector(selectOtherCostsTotal);

  const handleAddCost = () => {
    setSelectedOtherCost(null);
    onOpen();
  };

  const handleEditCost = (otherCost) => {
    setSelectedOtherCost(otherCost);
    onOpen();
  };

  const handleCloseForm = () => {
    setSelectedOtherCost(null);
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
        Error loading other costs: {error}
      </Alert>
    );
  }

  return (
    <Box>
      <Flex justify="space-between" align="center" mb={6}>
        <Box>
          <Heading size="lg" mb={2}>Other Costs</Heading>
          <HStack spacing={4}>
            <Text color="gray.600">
              {otherCosts.length} {otherCosts.length === 1 ? 'cost' : 'costs'}
            </Text>
            <Badge colorScheme="orange" variant="subtle" fontSize="sm" px={2} py={1}>
              Total: {formatCurrency(totalAmount)}
            </Badge>
          </HStack>
        </Box>
        
        <Button
          leftIcon={<AddIcon />}
          colorScheme="orange"
          onClick={handleAddCost}
        >
          Add Cost
        </Button>
      </Flex>

      {isLoading && (
        <Flex justify="center" py={8}>
          <Spinner size="lg" color="orange.500" />
        </Flex>
      )}

      {!isLoading && otherCosts.length === 0 && (
        <Box
          textAlign="center"
          py={12}
          bg="gray.50"
          borderRadius="lg"
          border="2px dashed"
          borderColor="gray.200"
        >
          <Text fontSize="lg" color="gray.500" mb={4}>
            No other costs added yet
          </Text>
          <Text color="gray.400" mb={6}>
            Add miscellaneous costs like shipping, taxes, or insurance
          </Text>
          <Button
            leftIcon={<AddIcon />}
            colorScheme="orange"
            onClick={handleAddCost}
          >
            Add Your First Cost
          </Button>
        </Box>
      )}

      {!isLoading && otherCosts.length > 0 && (
        <VStack spacing={4} align="stretch">
          {otherCosts.map((otherCost) => (
            <OtherCostCard
              key={otherCost.id}
              otherCost={otherCost}
              onEdit={handleEditCost}
            />
          ))}
        </VStack>
      )}

      <OtherCostForm
        isOpen={isOpen}
        onClose={handleCloseForm}
        otherCost={selectedOtherCost}
      />
    </Box>
  );
};

export default OtherCostList;