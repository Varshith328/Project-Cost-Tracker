// src/components/Items/ItemCard.js
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Card,
  CardBody,
  Flex,
  Text,
  IconButton,
  HStack,
  Badge,
  useToast,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Button,
  useDisclosure
} from '@chakra-ui/react';
import { EditIcon, DeleteIcon } from '@chakra-ui/icons';
import { deleteItem } from '../../store/slices/itemsSlice';

const ItemCard = ({ item, onEdit }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { isLoading } = useSelector((state) => state.items);
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = React.useRef();

  const handleDelete = async () => {
    try {
      await dispatch(deleteItem({
        userId: user.uid,
        itemId: item.id
      })).unwrap();
      
      toast({
        title: 'Item deleted successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete item',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
    onClose();
  };

  const formatDate = (date) => {
    if (!date) return '';
    const dateObj = date.toDate ? date.toDate() : new Date(date);
    return dateObj.toLocaleDateString();
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  return (
    <>
      <Card size="sm" variant="outline" _hover={{ shadow: 'md' }}>
        <CardBody>
          <Flex justify="space-between" align="start">
            <Box flex="1">
              <Text fontWeight="semibold" fontSize="lg" mb={2}>
                {item.name}
              </Text>
              <HStack spacing={4}>
                <Badge colorScheme="green" variant="subtle">
                  {formatCurrency(item.cost)}
                </Badge>
                {item.createdAt && (
                  <Text fontSize="sm" color="gray.500">
                    Added {formatDate(item.createdAt)}
                  </Text>
                )}
              </HStack>
            </Box>
            
            <HStack spacing={2}>
              <IconButton
                icon={<EditIcon />}
                size="sm"
                variant="ghost"
                colorScheme="blue"
                aria-label="Edit item"
                onClick={() => onEdit(item)}
              />
              <IconButton
                icon={<DeleteIcon />}
                size="sm"
                variant="ghost"
                colorScheme="red"
                aria-label="Delete item"
                onClick={onOpen}
              />
            </HStack>
          </Flex>
        </CardBody>
      </Card>

      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Delete Item
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure you want to delete "{item.name}"? This action cannot be undone.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                Cancel
              </Button>
              <Button
                colorScheme="red"
                onClick={handleDelete}
                ml={3}
                isLoading={isLoading}
                loadingText="Deleting..."
              >
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
};

export default ItemCard;