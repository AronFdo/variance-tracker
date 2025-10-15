import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
  serverTimestamp,
  Timestamp
} from 'firebase/firestore';
import { db } from './config';

/**
 * Generic function to get a single document
 * @param {string} collectionName - Name of the collection
 * @param {string} docId - Document ID
 * @returns {Promise<Object|null>}
 */
export const getDocument = async (collectionName, docId) => {
  try {
    const docRef = doc(db, collectionName, docId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error getting document:', error);
    throw error;
  }
};

/**
 * Generic function to get all documents from a collection
 * @param {string} collectionName - Name of the collection
 * @param {Object} options - Query options (where, orderBy, limit)
 * @returns {Promise<Array>}
 */
export const getDocuments = async (collectionName, options = {}) => {
  try {
    let q = collection(db, collectionName);
    
    // Apply where clauses
    if (options.where && Array.isArray(options.where)) {
      options.where.forEach(condition => {
        q = query(q, where(condition.field, condition.operator, condition.value));
      });
    }
    
    // Apply orderBy
    if (options.orderBy) {
      q = query(q, orderBy(options.orderBy.field, options.orderBy.direction || 'asc'));
    }
    
    // Apply limit
    if (options.limit) {
      q = query(q, limit(options.limit));
    }
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error getting documents:', error);
    throw error;
  }
};

/**
 * Add a new document to a collection
 * @param {string} collectionName - Name of the collection
 * @param {Object} data - Data to add
 * @returns {Promise<string>} Document ID
 */
export const addDocument = async (collectionName, data) => {
  try {
    const docRef = await addDoc(collection(db, collectionName), {
      ...data,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return docRef.id;
  } catch (error) {
    console.error('Error adding document:', error);
    throw error;
  }
};

/**
 * Update an existing document
 * @param {string} collectionName - Name of the collection
 * @param {string} docId - Document ID
 * @param {Object} data - Data to update
 * @returns {Promise<void>}
 */
export const updateDocument = async (collectionName, docId, data) => {
  try {
    const docRef = doc(db, collectionName, docId);
    await updateDoc(docRef, {
      ...data,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Error updating document:', error);
    throw error;
  }
};

/**
 * Delete a document
 * @param {string} collectionName - Name of the collection
 * @param {string} docId - Document ID
 * @returns {Promise<void>}
 */
export const deleteDocument = async (collectionName, docId) => {
  try {
    const docRef = doc(db, collectionName, docId);
    await deleteDoc(docRef);
  } catch (error) {
    console.error('Error deleting document:', error);
    throw error;
  }
};

/**
 * Subscribe to real-time updates for a single document
 * @param {string} collectionName - Name of the collection
 * @param {string} docId - Document ID
 * @param {Function} callback - Callback function that receives the document data
 * @returns {Function} Unsubscribe function
 */
export const subscribeToDocument = (collectionName, docId, callback) => {
  const docRef = doc(db, collectionName, docId);
  
  return onSnapshot(docRef, (docSnap) => {
    if (docSnap.exists()) {
      callback({ id: docSnap.id, ...docSnap.data() });
    } else {
      callback(null);
    }
  }, (error) => {
    console.error('Error in document subscription:', error);
  });
};

/**
 * Subscribe to real-time updates for a collection
 * @param {string} collectionName - Name of the collection
 * @param {Function} callback - Callback function that receives the documents array
 * @param {Object} options - Query options (where, orderBy, limit)
 * @returns {Function} Unsubscribe function
 */
export const subscribeToCollection = (collectionName, callback, options = {}) => {
  let q = collection(db, collectionName);
  
  // Apply where clauses
  if (options.where && Array.isArray(options.where)) {
    options.where.forEach(condition => {
      q = query(q, where(condition.field, condition.operator, condition.value));
    });
  }
  
  // Apply orderBy
  if (options.orderBy) {
    q = query(q, orderBy(options.orderBy.field, options.orderBy.direction || 'asc'));
  }
  
  // Apply limit
  if (options.limit) {
    q = query(q, limit(options.limit));
  }
  
  return onSnapshot(q, (querySnapshot) => {
    const documents = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    callback(documents);
  }, (error) => {
    console.error('Error in collection subscription:', error);
  });
};

/**
 * Convert Firestore Timestamp to JavaScript Date
 * @param {Timestamp} timestamp - Firestore Timestamp
 * @returns {Date|null}
 */
export const timestampToDate = (timestamp) => {
  if (!timestamp) return null;
  if (timestamp instanceof Timestamp) {
    return timestamp.toDate();
  }
  return timestamp;
};


