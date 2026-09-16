import { useState, useEffect, useCallback } from 'react';
import { db } from './firebase';
import { 
  collection, doc, setDoc, getDocs, deleteDoc, 
  query, where, onSnapshot 
} from 'firebase/firestore';
import { Test, User, TestResult } from '../types';
import { seedTests } from './seed';

// Global state that triggers React re-renders
let globalListeners: (() => void)[] = [];
let firebaseReady = false;

function notifyListeners() {
  globalListeners.forEach(fn => fn());
}

export function useSyncStore() {
  const [, setTick] = useState(0);
  
  useEffect(() => {
    const listener = () => setTick(t => t + 1);
    globalListeners.push(listener);
    return () => {
      globalListeners = globalListeners.filter(l => l !== listener);
    };
  }, []);
  
  return { refresh: () => setTick(t => t + 1) };
}

// Initialize Firebase with seed data
export async function initializeFirebase(): Promise<void> {
  if (firebaseReady) return;
  
  try {
    const testsRef = collection(db, 'tests');
    const snapshot = await getDocs(testsRef);
    
    if (snapshot.empty) {
      console.log('📝 Seeding tests to Firebase...');
      for (const test of seedTests) {
        await setDoc(doc(db, 'tests', test.id), test);
      }
      console.log('✅ Seed data added');
    }
    
    firebaseReady = true;
    console.log('✅ Firebase ready');
  } catch (e) {
    console.error('❌ Firebase init error:', e);
  }
}

// Get all tests from Firebase
export async function getTests(): Promise<Test[]> {
  try {
    const snapshot = await getDocs(collection(db, 'tests'));
    return snapshot.docs.map(d => d.data() as Test);
  } catch (e) {
    console.error('Failed to get tests:', e);
    return JSON.parse(localStorage.getItem('csthub_tests') || '[]');
  }
}

// Get test by ID
export async function getTestById(id: string): Promise<Test | undefined> {
  try {
    const tests = await getTests();
    return tests.find(t => t.id === id);
  } catch {
    return undefined;
  }
}

// Get test by slug
export async function getTestBySlug(slug: string): Promise<Test | undefined> {
  try {
    const tests = await getTests();
    return tests.find(t => t.slug === slug);
  } catch {
    return undefined;
  }
}

// Get test for student (without answers)
export async function getTestForStudent(slug: string) {
  const test = await getTestBySlug(slug);
  if (!test) return undefined;
  return {
    ...test,
    questions: test.questions.map(q => ({
      id: q.id,
      testId: q.testId,
      text: q.text,
      options: q.options,
    }))
  };
}

// Create test
export async function createTest(test: Test): Promise<void> {
  await setDoc(doc(db, 'tests', test.id), test);
  notifyListeners();
}

// Update test
export async function updateTest(id: string, updates: Partial<Test>): Promise<boolean> {
  try {
    const tests = await getTests();
    const test = tests.find(t => t.id === id);
    if (!test) return false;
    await setDoc(doc(db, 'tests', id), { ...test, ...updates });
    notifyListeners();
    return true;
  } catch {
    return false;
  }
}

// Delete test
export async function deleteTest(id: string): Promise<boolean> {
  try {
    await deleteDoc(doc(db, 'tests', id));
    // Also delete results for this test
    const results = await getResults();
    for (const r of results.filter(r => r.testId === id)) {
      await deleteDoc(doc(db, 'results', r.id));
    }
    notifyListeners();
    return true;
  } catch {
    return false;
  }
}

// Get all users
export async function getUsers(): Promise<User[]> {
  try {
    const snapshot = await getDocs(collection(db, 'users'));
    return snapshot.docs.map(d => d.data() as User);
  } catch (e) {
    console.error('Failed to get users:', e);
    return JSON.parse(localStorage.getItem('csthub_users') || '[]');
  }
}

// Get user by ID
export async function getUserById(id: string): Promise<User | undefined> {
  try {
    const users = await getUsers();
    return users.find(u => u.id === id);
  } catch {
    return undefined;
  }
}

// Get user by email
export async function getUserByEmail(email: string): Promise<User | undefined> {
  try {
    const q = query(collection(db, 'users'), where('email', '==', email.toLowerCase()));
    const snapshot = await getDocs(q);
    return snapshot.empty ? undefined : snapshot.docs[0].data() as User;
  } catch {
    return undefined;
  }
}

// Create user
export async function createUser(user: User): Promise<void> {
  await setDoc(doc(db, 'users', user.id), user);
  notifyListeners();
}

// Update user
export async function updateUser(id: string, updates: Partial<User>): Promise<boolean> {
  try {
    const users = await getUsers();
    const user = users.find(u => u.id === id);
    if (!user) return false;
    await setDoc(doc(db, 'users', id), { ...user, ...updates });
    notifyListeners();
    return true;
  } catch {
    return false;
  }
}

// Delete user
export async function deleteUser(id: string): Promise<boolean> {
  try {
    await deleteDoc(doc(db, 'users', id));
    const results = await getResults();
    for (const r of results.filter(r => r.userId === id)) {
      await deleteDoc(doc(db, 'results', r.id));
    }
    notifyListeners();
    return true;
  } catch {
    return false;
  }
}

// Get all results
export async function getResults(): Promise<TestResult[]> {
  try {
    const snapshot = await getDocs(collection(db, 'results'));
    return snapshot.docs.map(d => d.data() as TestResult);
  } catch (e) {
    console.error('Failed to get results:', e);
    return JSON.parse(localStorage.getItem('csthub_results') || '[]');
  }
}

// Get results by user ID
export async function getResultsByUserId(userId: string): Promise<TestResult[]> {
  try {
    const q = query(collection(db, 'results'), where('userId', '==', userId));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(d => d.data() as TestResult);
  } catch {
    return [];
  }
}

// Get results by test ID
export async function getResultsByTestId(testId: string): Promise<TestResult[]> {
  try {
    const q = query(collection(db, 'results'), where('testId', '==', testId));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(d => d.data() as TestResult);
  } catch {
    return [];
  }
}

// Get result by ID
export async function getResultById(id: string): Promise<TestResult | undefined> {
  try {
    const results = await getResults();
    return results.find(r => r.id === id);
  } catch {
    return undefined;
  }
}

// Create result
export async function createResult(result: TestResult): Promise<void> {
  await setDoc(doc(db, 'results', result.id), result);
  notifyListeners();
}

// Delete result
export async function deleteResult(id: string): Promise<boolean> {
  try {
    await deleteDoc(doc(db, 'results', id));
    notifyListeners();
    return true;
  } catch {
    return false;
  }
}

// Check if user submitted test
export async function hasUserSubmittedTest(userId: string, testId: string): Promise<boolean> {
  const results = await getResultsByUserId(userId);
  return results.some(r => r.testId === testId);
}

// Grade test
export async function gradeTest(testId: string, answers: Record<string, number>) {
  const test = await getTestById(testId);
  if (!test) throw new Error('Test not found');

  let score = 0;
  const total = test.questions.length;

  test.questions.forEach(q => {
    if (answers[q.id] === q.correctAnswer) score++;
  });

  return { score, total, percentage: Math.round((score / total) * 100) };
}

// Set up real-time listeners
export function setupRealtimeSync() {
  try {
    onSnapshot(collection(db, 'tests'), async (snapshot) => {
      const tests = snapshot.docs.map(d => d.data() as Test);
      localStorage.setItem('csthub_tests', JSON.stringify(tests));
      console.log('🔄 Tests updated from Firebase:', tests.length, 'tests');
      notifyListeners();
    });

    onSnapshot(collection(db, 'users'), async (snapshot) => {
      const users = snapshot.docs.map(d => d.data() as User);
      localStorage.setItem('csthub_users', JSON.stringify(users));
      console.log('🔄 Users updated from Firebase:', users.length, 'users');
      notifyListeners();
    });

    onSnapshot(collection(db, 'results'), async (snapshot) => {
      const results = snapshot.docs.map(d => d.data() as TestResult);
      localStorage.setItem('csthub_results', JSON.stringify(results));
      console.log('🔄 Results updated from Firebase:', results.length, 'results');
      notifyListeners();
    });

    console.log('✅ Real-time sync active');
  } catch (e) {
    console.error('❌ Real-time sync failed:', e);
  }
}

// Helper functions for store.ts
export async function getAll(collectionName: string): Promise<any[]> {
  try {
    const snapshot = await getDocs(collection(db, collectionName));
    return snapshot.docs.map(d => d.data());
  } catch (e) {
    console.error(`Failed to get ${collectionName}:`, e);
    return [];
  }
}

export async function saveToFirebase(collectionName: string, id: string, data: any): Promise<void> {
  try {
    await setDoc(doc(db, collectionName, id), data);
  } catch (e) {
    console.error(`Failed to save ${collectionName}/${id}:`, e);
    throw e;
  }
}

export async function deleteFromFirebase(collectionName: string, id: string): Promise<void> {
  try {
    await deleteDoc(doc(db, collectionName, id));
  } catch (e) {
    console.error(`Failed to delete ${collectionName}/${id}:`, e);
    throw e;
  }
}
