// src/components/Dashboard/Dashboard.js
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Grid,
  GridItem,
  Card,
  CardBody,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  VStack,
  HStack,
  Text,
  Badge,
  Divider,
  Icon,
  Flex
} from '@chakra-ui/react';
import { MdInventory, MdAttachMoney, MdAccountBalance } from 'react-icons/md';
import ItemList from '../Items/ItemList';
import OtherCostList from '../OtherCosts/OtherCostList';
import { fetchItems, selectItemsTotal } from '../../store/slices/itemsSlice';
import { fetchOtherCosts, selectOtherCostsTotal } from '../../store/slices/otherCostsSlice';

const Dashboard = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const items = useSelector((state) => state.items.items);
  const otherCosts = useSelector((state) => state.otherCosts.otherCosts);
  const itemsTotal = useSelector(selectItemsTotal);
  const otherCostsTotal = useSelector(selectOtherCostsTotal);

  const totalProjectCost = itemsTotal + otherCostsTotal;

  useEffect(() => {
    if (user?.uid) {
      dispatch(fetchItems(user.uid));
      dispatch(fetchOtherCosts(user.uid));
    }
  }, [dispatch, user]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const StatCard = ({ icon, label, value, helpText, colorScheme = "teal" }) => (
    <Card>
      <CardBody>
        <Stat>
          <Flex align="center" mb={2}>
            <Icon as={icon} boxSize={6} color={`${colorScheme}.500`} mr={3} />
            <StatLabel fontSize="md" fontWeight="medium">
              {label}
            </StatLabel>
          </Flex>
          <StatNumber fontSize="2xl" color={`${colorScheme}.600`}>
            {value}
          </StatNumber>
          {helpText && (
            <StatHelpText fontSize="sm" color="gray.600">
              {helpText}
            </StatHelpText>
          )}
        </Stat>
      </CardBody>
    </Card>
  );

  return (
    <Box>
      {/* Summary Cards */}
      <Grid templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }} gap={6} mb={8}>
        <GridItem>
          <StatCard
            icon={MdAccountBalance}
            label="Total Project Cost"
            value={formatCurrency(totalProjectCost)}
            helpText="Items + Other Costs"
            colorScheme="purple"
          />
        </GridItem>
        <GridItem>
          <StatCard
            icon={MdInventory}
            label="Items Total"
            value={formatCurrency(itemsTotal)}
            helpText={`${items.length} ${items.length === 1 ? 'item' : 'items'}`}
            colorScheme="teal"
          />
        </GridItem>
        <GridItem>
          <StatCard
            icon={MdAttachMoney}
            label="Other Costs Total"
            value={formatCurrency(otherCostsTotal)}
            helpText={`${otherCosts.length} ${otherCosts.length === 1 ? 'cost' : 'costs'}`}
            colorScheme="orange"
          />
        </GridItem>
      </Grid>

      {/* Cost Breakdown */}
      {totalProjectCost > 0 && (
        <Card mb={8}>
          <CardBody>
            <Text fontSize="lg" fontWeight="semibold" mb={4}>
              Cost Breakdown
            </Text>
            <VStack spacing={4} align="stretch">
              <HStack justify="space-between">
                <HStack>
                  <Badge colorScheme="teal" variant="subtle">Items</Badge>
                  <Text>Hardware, Software, Services</Text>
                </HStack>
                <Text fontWeight="semibold">{formatCurrency(itemsTotal)}</Text>
              </HStack>
              
              <HStack justify="space-between">
                <HStack>
                  <Badge colorScheme="orange" variant="subtle">Other Costs</Badge>
                  <Text>Shipping, Taxes, Insurance</Text>
                </HStack>
                <Text fontWeight="semibold">{formatCurrency(otherCostsTotal)}</Text>
              </HStack>
              
              <Divider />
              
              <HStack justify="space-between">
                <Text fontSize="lg" fontWeight="bold">Total Project Cost</Text>
                <Text fontSize="lg" fontWeight="bold" color="purple.600">
                  {formatCurrency(totalProjectCost)}
                </Text>
              </HStack>
            </VStack>
          </CardBody>
        </Card>
      )}

      {/* Items and Other Costs Lists */}
      <Grid templateColumns={{ base: "1fr", lg: "1fr 1fr" }} gap={8}>
        <GridItem>
          <ItemList />
        </GridItem>
        <GridItem>
          <OtherCostList />
        </GridItem>
      </Grid>
    </Box>
  );
};

export default Dashboard;