import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  setDoc,
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

/**
 * Get user profile by UID
 * @param {string} uid - User UID
 * @returns {Promise<Object|null>}
 */
export const getUserProfile = async (uid) => {
  try {
    return await getDocument('users', uid);
  } catch (error) {
    console.error('Error getting user profile:', error);
    throw error;
  }
};

/**
 * Create or update user profile
 * @param {string} uid - User UID
 * @param {Object} profileData - Profile data
 * @returns {Promise<void>}
 */
export const createUserProfile = async (uid, profileData) => {
  try {
    const userRef = doc(db, 'users', uid);
    await setDoc(userRef, {
      ...profileData,
      uid,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    }, { merge: true });
  } catch (error) {
    console.error('Error creating user profile:', error);
    throw error;
  }
};

/**
 * Create staff profile with additional staff-specific fields
 * @param {string} uid - User UID
 * @param {Object} profileData - Profile data
 * @returns {Promise<void>}
 */
export const createStaffProfile = async (uid, profileData) => {
  try {
    const staffData = {
      ...profileData,
      role: 'staff',
      clients: profileData.clients || [],
      rate: profileData.rate || 40,
      status: profileData.status || 'pending'
    };
    await createUserProfile(uid, staffData);
  } catch (error) {
    console.error('Error creating staff profile:', error);
    throw error;
  }
};

/**
 * Create HR profile with additional HR-specific fields
 * @param {string} uid - User UID
 * @param {Object} profileData - Profile data
 * @returns {Promise<void>}
 */
export const createHRProfile = async (uid, profileData) => {
  try {
    const hrData = {
      ...profileData,
      role: 'hr',
      permissions: profileData.permissions || ['view_all', 'manage_staff', 'manage_clients'],
      department: profileData.department || 'HR'
    };
    await createUserProfile(uid, hrData);
  } catch (error) {
    console.error('Error creating HR profile:', error);
    throw error;
  }
};

/**
 * Add a time entry for a staff member
 * @param {Object} timeEntryData - Time entry data
 * @returns {Promise<string>} Document ID
 */
export const addTimeEntry = async (timeEntryData) => {
  try {
    const docId = await addDocument('timeEntries', {
      ...timeEntryData,
      startTime: timeEntryData.startTime instanceof Date ? timeEntryData.startTime : new Date(timeEntryData.startTime),
      endTime: timeEntryData.endTime instanceof Date ? timeEntryData.endTime : new Date(timeEntryData.endTime)
    });
    return docId;
  } catch (error) {
    console.error('Error adding time entry:', error);
    throw error;
  }
};

/**
 * Get time entries for a specific staff member
 * @param {string} staffId - Staff UID
 * @param {Object} options - Query options
 * @returns {Promise<Array>}
 */
export const getTimeEntriesByStaff = async (staffId, options = {}) => {
  try {
    const whereConditions = [
      { field: 'staffId', operator: '==', value: staffId }
    ];
    
    if (options.startDate) {
      whereConditions.push({ field: 'date', operator: '>=', value: options.startDate });
    }
    
    if (options.endDate) {
      whereConditions.push({ field: 'date', operator: '<=', value: options.endDate });
    }
    
    return await getDocuments('timeEntries', {
      where: whereConditions,
      orderBy: options.orderBy || { field: 'createdAt', direction: 'desc' }
    });
  } catch (error) {
    console.error('Error getting time entries:', error);
    throw error;
  }
};

/**
 * Get all assignments for a specific staff member
 * @param {string} staffId - Staff UID
 * @returns {Promise<Array>}
 */
export const getStaffAssignments = async (staffId) => {
  try {
    return await getDocuments('assignments', {
      where: [{ field: 'staffId', operator: '==', value: staffId }]
    });
  } catch (error) {
    console.error('Error getting staff assignments:', error);
    throw error;
  }
};

/**
 * Get time entries grouped by client for a staff member
 * @param {string} staffId - Staff UID
 * @param {Object} options - Query options
 * @returns {Promise<Object>} Object with client names as keys and stats as values
 */
export const getTimeEntriesByClient = async (staffId, options = {}) => {
  try {
    const timeEntries = await getTimeEntriesByStaff(staffId, options);
    
    // Group by client and calculate totals
    const clientSummary = {};
    
    timeEntries.forEach(entry => {
      const clientName = entry.client || 'Unassigned';
      
      if (!clientSummary[clientName]) {
        clientSummary[clientName] = {
          totalHours: 0,
          totalBreakTime: 0,
          workHours: 0,
          sessions: 0,
          entries: []
        };
      }
      
      const totalTime = entry.totalTime || 0;
      const breakTime = entry.breakTime || 0;
      const workTime = totalTime - breakTime;
      
      clientSummary[clientName].totalHours += totalTime / 3600;
      clientSummary[clientName].totalBreakTime += breakTime / 3600;
      clientSummary[clientName].workHours += workTime / 3600;
      clientSummary[clientName].sessions += 1;
      clientSummary[clientName].entries.push(entry);
    });
    
    // Round to 2 decimal places
    Object.keys(clientSummary).forEach(client => {
      clientSummary[client].totalHours = Math.round(clientSummary[client].totalHours * 100) / 100;
      clientSummary[client].totalBreakTime = Math.round(clientSummary[client].totalBreakTime * 100) / 100;
      clientSummary[client].workHours = Math.round(clientSummary[client].workHours * 100) / 100;
    });
    
    return clientSummary;
  } catch (error) {
    console.error('Error getting time entries by client:', error);
    throw error;
  }
};


