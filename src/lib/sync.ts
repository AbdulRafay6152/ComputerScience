import * as firebaseStore from './firebaseStore';
import * as localStore from './store';

// Sync data from Firebase to localStorage on app load
export async function syncFromFirebase() {
  try {
    console.log('🔄 Syncing data from Firebase...');
    
    // Sync tests
    const firebaseTests = await firebaseStore.getTests();
    if (firebaseTests.length > 0) {
      localStorage.setItem('csthub_tests', JSON.stringify(firebaseTests));
      console.log(`✅ Synced ${firebaseTests.length} tests from Firebase`);
    }
    
    // Sync users
    const firebaseUsers = await firebaseStore.getUsers();
    if (firebaseUsers.length > 0) {
      localStorage.setItem('csthub_users', JSON.stringify(firebaseUsers));
      console.log(`✅ Synced ${firebaseUsers.length} users from Firebase`);
    }
    
    // Sync results
    const firebaseResults = await firebaseStore.getResults();
    if (firebaseResults.length > 0) {
      localStorage.setItem('csthub_results', JSON.stringify(firebaseResults));
      console.log(`✅ Synced ${firebaseResults.length} results from Firebase`);
    }
    
    console.log('✅ Sync complete!');
  } catch (error) {
    console.error('❌ Sync failed:', error);
  }
}

// Sync data from localStorage to Firebase when data changes
export async function syncToFirebase() {
  try {
    console.log('🔄 Syncing data to Firebase...');
    
    // Sync tests
    const localTests = localStore.getTests();
    for (const test of localTests) {
      await firebaseStore.createTest(test);
    }
    console.log(`✅ Synced ${localTests.length} tests to Firebase`);
    
    // Sync users (without password hashes for security)
    const localUsers = localStore.getUsers();
    for (const user of localUsers) {
      await firebaseStore.createUser(user);
    }
    console.log(`✅ Synced ${localUsers.length} users to Firebase`);
    
    // Sync results
    const localResults = localStore.getResults();
    for (const result of localResults) {
      await firebaseStore.createResult(result);
    }
    console.log(`✅ Synced ${localResults.length} results to Firebase`);
    
    console.log('✅ Sync complete!');
  } catch (error) {
    console.error('❌ Sync failed:', error);
  }
}

// Initialize Firebase with seed data if empty
export async function initializeFirebase() {
  try {
    await firebaseStore.initializeTests();
    console.log('✅ Firebase initialized with seed data');
  } catch (error) {
    console.error('❌ Firebase initialization failed:', error);
  }
}

// Set up real-time listeners to keep localStorage in sync
export function setupRealtimeSync() {
  // Listen for test changes
  firebaseStore.subscribeToTests((tests) => {
    localStorage.setItem('csthub_tests', JSON.stringify(tests));
    console.log('🔄 Tests updated from Firebase');
    // Trigger a custom event to notify components
    window.dispatchEvent(new CustomEvent('data-updated'));
  });
  
  // Listen for result changes
  firebaseStore.subscribeToResults((results) => {
    localStorage.setItem('csthub_results', JSON.stringify(results));
    console.log('🔄 Results updated from Firebase');
    window.dispatchEvent(new CustomEvent('data-updated'));
  });
  
  // Listen for user changes
  firebaseStore.subscribeToUsers((users) => {
    localStorage.setItem('csthub_users', JSON.stringify(users));
    console.log('🔄 Users updated from Firebase');
    window.dispatchEvent(new CustomEvent('data-updated'));
  });
}
