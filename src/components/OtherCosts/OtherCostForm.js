// src/components/OtherCosts/OtherCostForm.js
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  FormControl,
  FormLabel,
  Input,
  NumberInput,
  NumberInputField,
  Textarea,
  VStack,
  Text,
  useToast
} from '@chakra-ui/react';
import { addOtherCost, updateOtherCost } from '../../store/slices/otherCostsSlice';

const OtherCostForm = ({ isOpen, onClose, otherCost = null }) => {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [descriptionError, setDescriptionError] = useState('');
  const [amountError, setAmountError] = useState('');

  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { isLoading } = useSelector((state) => state.otherCosts);
  const toast = useToast();

  const isEditMode = !!otherCost;

  useEffect(() => {
    if (otherCost) {
      setDescription(otherCost.description || '');
      setAmount(otherCost.amount?.toString() || '');
    } else {
      setDescription('');
      setAmount('');
    }
    setDescriptionError('');
    setAmountError('');
  }, [otherCost, isOpen]);

  const validateForm = () => {
    let isValid = true;
    setDescriptionError('');
    setAmountError('');

    if (!description.trim()) {
      setDescriptionError('Description is required');
      isValid = false;
    }

    if (!amount || amount === '0') {
      setAmountError('Amount must be greater than 0');
      isValid = false;
    } else if (isNaN(amount) || parseFloat(amount) <= 0) {
      setAmountError('Please enter a valid amount');
      isValid = false;
    }

    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    const costData = {
      description: description.trim(),
      amount: parseFloat(amount)
    };

    try {
      if (isEditMode) {
        await dispatch(updateOtherCost({
          userId: user.uid,
          costId: otherCost.id,
          updates: costData
        })).unwrap();
        
        toast({
          title: 'Other cost updated successfully',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      } else {
        await dispatch(addOtherCost({
          userId: user.uid,
          otherCost: costData
        })).unwrap();
        
        toast({
          title: 'Other cost added successfully',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      }
      
      onClose();
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message || 'Something went wrong',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleClose = () => {
    setDescription('');
    setAmount('');
    setDescriptionError('');
    setAmountError('');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="md">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          {isEditMode ? 'Edit Other Cost' : 'Add Other Cost'}
        </ModalHeader>
        <ModalCloseButton />
        
        <form onSubmit={handleSubmit}>
          <ModalBody>
            <VStack spacing={4}>
              <FormControl isInvalid={descriptionError}>
                <FormLabel>Description</FormLabel>
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="e.g., Shipping fees, Taxes, Insurance"
                  focusBorderColor="teal.500"
                  rows={3}
                />
                {descriptionError && (
                  <Text color="red.500" fontSize="sm" mt={1}>
                    {descriptionError}
                  </Text>
                )}
              </FormControl>

              <FormControl isInvalid={amountError}>
                <FormLabel>Amount ($)</FormLabel>
                <NumberInput
                  value={amount}
                  onChange={(value) => setAmount(value)}
                  min={0}
                  precision={2}
                  focusBorderColor="teal.500"
                >
                  <NumberInputField placeholder="0.00" />
                </NumberInput>
                {amountError && (
                  <Text color="red.500" fontSize="sm" mt={1}>
                    {amountError}
                  </Text>
                )}
              </FormControl>
            </VStack>
          </ModalBody>

          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={handleClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              colorScheme="teal"
              isLoading={isLoading}
              loadingText={isEditMode ? 'Updating...' : 'Adding...'}
            >
              {isEditMode ? 'Update Cost' : 'Add Cost'}
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
};

export default OtherCostForm;