import { db } from './firebase';
import { 
  collection, doc, setDoc, getDocs, deleteDoc, 
  query, where, onSnapshot 
} from 'firebase/firestore';
import { Test, User, TestResult } from '../types';
import { seedTests } from './seed';

// Simple helper to read/write from Firestore
async function getAll(collectionName: string): Promise<any[]> {
  try {
    const snapshot = await getDocs(collection(db, collectionName));
    return snapshot.docs.map(d => d.data());
  } catch (e) {
    console.error(`Failed to get ${collectionName}:`, e);
    return [];
  }
}

async function setItem(collectionName: string, id: string, data: any): Promise<void> {
  try {
    await setDoc(doc(db, collectionName, id), data);
  } catch (e) {
    console.error(`Failed to set ${collectionName}/${id}:`, e);
  }
}

async function removeItem(collectionName: string, id: string): Promise<void> {
  try {
    await deleteDoc(doc(db, collectionName, id));
  } catch (e) {
    console.error(`Failed to delete ${collectionName}/${id}:`, e);
  }
}

async function getByField(collectionName: string, field: string, value: any): Promise<any[]> {
  try {
    const q = query(collection(db, collectionName), where(field, '==', value));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(d => d.data());
  } catch (e) {
    console.error(`Failed to query ${collectionName}:`, e);
    return [];
  }
}

// Initialize seed tests if Firestore is empty
export async function initializeFirebase() {
  try {
    const tests = await getAll('tests');
    if (tests.length === 0) {
      console.log('📝 Seeding initial tests to Firebase...');
      for (const test of seedTests) {
        await setItem('tests', test.id, test);
      }
      console.log('✅ Seed data added to Firebase');
    }
  } catch (e) {
    console.error('❌ Firebase init failed:', e);
  }
}

// Pull all data from Firebase → localStorage
export async function syncFromFirebase() {
  try {
    console.log('🔄 Pulling data from Firebase...');
    
    const [tests, users, results] = await Promise.all([
      getAll('tests'),
      getAll('users'),
      getAll('results'),
    ]);

    if (tests.length > 0) {
      localStorage.setItem('csthub_tests', JSON.stringify(tests));
    }
    if (users.length > 0) {
      localStorage.setItem('csthub_users', JSON.stringify(users));
    }
    if (results.length > 0) {
      localStorage.setItem('csthub_results', JSON.stringify(results));
    }

    console.log(`✅ Synced: ${tests.length} tests, ${users.length} users, ${results.length} results`);
  } catch (e) {
    console.error('❌ Sync from Firebase failed:', e);
  }
}

// Push all data from localStorage → Firebase
export async function syncToFirebase() {
  try {
    console.log('🔄 Pushing data to Firebase...');

    const tests = JSON.parse(localStorage.getItem('csthub_tests') || '[]');
    const users = JSON.parse(localStorage.getItem('csthub_users') || '[]');
    const results = JSON.parse(localStorage.getItem('csthub_results') || '[]');

    for (const test of tests) {
      await setItem('tests', test.id, test);
    }
    for (const user of users) {
      await setItem('users', user.id, user);
    }
    for (const result of results) {
      await setItem('results', result.id, result);
    }

    console.log(`✅ Pushed: ${tests.length} tests, ${users.length} users, ${results.length} results`);
  } catch (e) {
    console.error('❌ Sync to Firebase failed:', e);
  }
}

// Listen for real-time changes from Firebase → update localStorage
export function setupRealtimeSync() {
  try {
    // Listen for test changes
    onSnapshot(collection(db, 'tests'), (snapshot) => {
      const tests = snapshot.docs.map(d => d.data() as Test);
      localStorage.setItem('csthub_tests', JSON.stringify(tests));
      window.dispatchEvent(new Event('csthub-data-changed'));
      console.log('🔄 Tests updated from Firebase');
    });

    // Listen for user changes
    onSnapshot(collection(db, 'users'), (snapshot) => {
      const users = snapshot.docs.map(d => d.data() as User);
      localStorage.setItem('csthub_users', JSON.stringify(users));
      window.dispatchEvent(new Event('csthub-data-changed'));
      console.log('🔄 Users updated from Firebase');
    });

    // Listen for result changes
    onSnapshot(collection(db, 'results'), (snapshot) => {
      const results = snapshot.docs.map(d => d.data() as TestResult);
      localStorage.setItem('csthub_results', JSON.stringify(results));
      window.dispatchEvent(new Event('csthub-data-changed'));
      console.log('🔄 Results updated from Firebase');
    });

    console.log('✅ Real-time sync active');
  } catch (e) {
    console.error('❌ Real-time sync failed:', e);
  }
}

// Save a single item to Firebase (called when data changes locally)
export async function saveToFirebase(collectionName: string, id: string, data: any) {
  await setItem(collectionName, id, data);
}

// Delete a single item from Firebase
export async function deleteFromFirebase(collectionName: string, id: string) {
  await removeItem(collectionName, id);
}
