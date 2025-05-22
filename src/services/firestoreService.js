// src/services/firestoreService.js
import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  query,
  where,
  orderBy,
  onSnapshot
} from 'firebase/firestore';
import { db } from './firebase';

class FirestoreService {
  // Items CRUD operations
  async addItem(userId, item) {
    try {
      const itemsRef = collection(db, 'users', userId, 'items');
      const docRef = await addDoc(itemsRef, {
        ...item,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      return docRef.id;
    } catch (error) {
      console.error('Error adding item:', error);
      throw error;
    }
  }

  async updateItem(userId, itemId, updates) {
    try {
      const itemRef = doc(db, 'users', userId, 'items', itemId);
      await updateDoc(itemRef, {
        ...updates,
        updatedAt: new Date()
      });
    } catch (error) {
      console.error('Error updating item:', error);
      throw error;
    }
  }

  async deleteItem(userId, itemId) {
    try {
      const itemRef = doc(db, 'users', userId, 'items', itemId);
      await deleteDoc(itemRef);
    } catch (error) {
      console.error('Error deleting item:', error);
      throw error;
    }
  }

  async getItems(userId) {
    try {
      const itemsRef = collection(db, 'users', userId, 'items');
      const q = query(itemsRef, orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      
      const items = [];
      querySnapshot.forEach((doc) => {
        items.push({
          id: doc.id,
          ...doc.data()
        });
      });
      return items;
    } catch (error) {
      console.error('Error getting items:', error);
      throw error;
    }
  }

  // Real-time listener for items
  subscribeToItems(userId, callback) {
    const itemsRef = collection(db, 'users', userId, 'items');
    const q = query(itemsRef, orderBy('createdAt', 'desc'));
    
    return onSnapshot(q, (querySnapshot) => {
      const items = [];
      querySnapshot.forEach((doc) => {
        items.push({
          id: doc.id,
          ...doc.data()
        });
      });
      callback(items);
    });
  }

  // Other Costs CRUD operations
  async addOtherCost(userId, otherCost) {
    try {
      const otherCostsRef = collection(db, 'users', userId, 'otherCosts');
      const docRef = await addDoc(otherCostsRef, {
        ...otherCost,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      return docRef.id;
    } catch (error) {
      console.error('Error adding other cost:', error);
      throw error;
    }
  }

  async updateOtherCost(userId, costId, updates) {
    try {
      const costRef = doc(db, 'users', userId, 'otherCosts', costId);
      await updateDoc(costRef, {
        ...updates,
        updatedAt: new Date()
      });
    } catch (error) {
      console.error('Error updating other cost:', error);
      throw error;
    }
  }

  async deleteOtherCost(userId, costId) {
    try {
      const costRef = doc(db, 'users', userId, 'otherCosts', costId);
      await deleteDoc(costRef);
    } catch (error) {
      console.error('Error deleting other cost:', error);
      throw error;
    }
  }

  async getOtherCosts(userId) {
    try {
      const otherCostsRef = collection(db, 'users', userId, 'otherCosts');
      const q = query(otherCostsRef, orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      
      const costs = [];
      querySnapshot.forEach((doc) => {
        costs.push({
          id: doc.id,
          ...doc.data()
        });
      });
      return costs;
    } catch (error) {
      console.error('Error getting other costs:', error);
      throw error;
    }
  }

  // Real-time listener for other costs
  subscribeToOtherCosts(userId, callback) {
    const otherCostsRef = collection(db, 'users', userId, 'otherCosts');
    const q = query(otherCostsRef, orderBy('createdAt', 'desc'));
    
    return onSnapshot(q, (querySnapshot) => {
      const costs = [];
      querySnapshot.forEach((doc) => {
        costs.push({
          id: doc.id,
          ...doc.data()
        });
      });
      callback(costs);
    });
  }
}

export default new FirestoreService();