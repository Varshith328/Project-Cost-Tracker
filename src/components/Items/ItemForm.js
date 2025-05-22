// src/components/Items/ItemForm.js
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
  VStack,
  Text,
  useToast
} from '@chakra-ui/react';
import { addItem, updateItem } from '../../store/slices/itemsSlice';

const ItemForm = ({ isOpen, onClose, item = null }) => {
  const [name, setName] = useState('');
  const [cost, setCost] = useState('');
  const [nameError, setNameError] = useState('');
  const [costError, setCostError] = useState('');

  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { isLoading } = useSelector((state) => state.items);
  const toast = useToast();

  const isEditMode = !!item;

  useEffect(() => {
    if (item) {
      setName(item.name || '');
      setCost(item.cost?.toString() || '');
    } else {
      setName('');
      setCost('');
    }
    setNameError('');
    setCostError('');
  }, [item, isOpen]);

  const validateForm = () => {
    let isValid = true;
    setNameError('');
    setCostError('');

    if (!name.trim()) {
      setNameError('Item name is required');
      isValid = false;
    }

    if (!cost || cost === '0') {
      setCostError('Cost must be greater than 0');
      isValid = false;
    } else if (isNaN(cost) || parseFloat(cost) <= 0) {
      setCostError('Please enter a valid cost');
      isValid = false;
    }

    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    const itemData = {
      name: name.trim(),
      cost: parseFloat(cost)
    };

    try {
      if (isEditMode) {
        await dispatch(updateItem({
          userId: user.uid,
          itemId: item.id,
          updates: itemData
        })).unwrap();
        
        toast({
          title: 'Item updated successfully',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      } else {
        await dispatch(addItem({
          userId: user.uid,
          item: itemData
        })).unwrap();
        
        toast({
          title: 'Item added successfully',
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
    setName('');
    setCost('');
    setNameError('');
    setCostError('');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="md">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          {isEditMode ? 'Edit Item' : 'Add New Item'}
        </ModalHeader>
        <ModalCloseButton />
        
        <form onSubmit={handleSubmit}>
          <ModalBody>
            <VStack spacing={4}>
              <FormControl isInvalid={nameError}>
                <FormLabel>Item Name</FormLabel>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g., MacBook Pro, Software License"
                  focusBorderColor="teal.500"
                />
                {nameError && (
                  <Text color="red.500" fontSize="sm" mt={1}>
                    {nameError}
                  </Text>
                )}
              </FormControl>

              <FormControl isInvalid={costError}>
                <FormLabel>Cost ($)</FormLabel>
                <NumberInput
                  value={cost}
                  onChange={(value) => setCost(value)}
                  min={0}
                  precision={2}
                  focusBorderColor="teal.500"
                >
                  <NumberInputField placeholder="0.00" />
                </NumberInput>
                {costError && (
                  <Text color="red.500" fontSize="sm" mt={1}>
                    {costError}
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
              {isEditMode ? 'Update Item' : 'Add Item'}
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
};

export default ItemForm;