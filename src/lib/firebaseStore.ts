import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  deleteDoc,
  query,
  where,
  onSnapshot
} from 'firebase/firestore';
import { db } from './firebase';
import { User, Test, TestResult } from '../types';
import { seedTests } from './seed';

// Collection names
const USERS_COLLECTION = 'users';
const TESTS_COLLECTION = 'tests';
const RESULTS_COLLECTION = 'results';

// Initialize tests if not present
export async function initializeTests(): Promise<void> {
  const testsRef = collection(db, TESTS_COLLECTION);
  const snapshot = await getDocs(testsRef);
  
  if (snapshot.empty) {
    // Seed initial tests
    for (const test of seedTests) {
      await setDoc(doc(db, TESTS_COLLECTION, test.id), test);
    }
  }
}

// ---- USERS ----
export async function getUsers(): Promise<User[]> {
  const usersRef = collection(db, USERS_COLLECTION);
  const snapshot = await getDocs(usersRef);
  return snapshot.docs.map(doc => doc.data() as User);
}

export async function getUserById(id: string): Promise<User | undefined> {
  const userRef = doc(db, USERS_COLLECTION, id);
  const snapshot = await getDoc(userRef);
  return snapshot.exists() ? snapshot.data() as User : undefined;
}

export async function getUserByEmail(email: string): Promise<User | undefined> {
  const usersRef = collection(db, USERS_COLLECTION);
  const q = query(usersRef, where('email', '==', email.toLowerCase()));
  const snapshot = await getDocs(q);
  return snapshot.empty ? undefined : snapshot.docs[0].data() as User;
}

export async function createUser(user: User): Promise<void> {
  const userRef = doc(db, USERS_COLLECTION, user.id);
  await setDoc(userRef, user);
}

export async function updateUser(id: string, updates: Partial<Omit<User, 'id' | 'passwordHash'>>): Promise<boolean> {
  const userRef = doc(db, USERS_COLLECTION, id);
  const snapshot = await getDoc(userRef);
  if (!snapshot.exists()) return false;
  
  await setDoc(userRef, { ...snapshot.data(), ...updates });
  return true;
}

export async function deleteUser(id: string): Promise<boolean> {
  const userRef = doc(db, USERS_COLLECTION, id);
  const snapshot = await getDoc(userRef);
  if (!snapshot.exists()) return false;
  
  await deleteDoc(userRef);
  
  // Delete user's results
  const resultsRef = collection(db, RESULTS_COLLECTION);
  const q = query(resultsRef, where('userId', '==', id));
  const resultsSnapshot = await getDocs(q);
  for (const docSnap of resultsSnapshot.docs) {
    await deleteDoc(docSnap.ref);
  }
  
  return true;
}

// ---- TESTS ----
export async function getTests(): Promise<Test[]> {
  const testsRef = collection(db, TESTS_COLLECTION);
  const snapshot = await getDocs(testsRef);
  return snapshot.docs.map(doc => doc.data() as Test);
}

export async function getTestById(id: string): Promise<Test | undefined> {
  const testRef = doc(db, TESTS_COLLECTION, id);
  const snapshot = await getDoc(testRef);
  return snapshot.exists() ? snapshot.data() as Test : undefined;
}

export async function getTestBySlug(slug: string): Promise<Test | undefined> {
  const testsRef = collection(db, TESTS_COLLECTION);
  const q = query(testsRef, where('slug', '==', slug));
  const snapshot = await getDocs(q);
  return snapshot.empty ? undefined : snapshot.docs[0].data() as Test;
}

export async function createTest(test: Test): Promise<void> {
  const testRef = doc(db, TESTS_COLLECTION, test.id);
  await setDoc(testRef, test);
}

export async function updateTest(id: string, updates: Partial<Omit<Test, 'id'>>): Promise<boolean> {
  const testRef = doc(db, TESTS_COLLECTION, id);
  const snapshot = await getDoc(testRef);
  if (!snapshot.exists()) return false;
  
  await setDoc(testRef, { ...snapshot.data(), ...updates });
  return true;
}

export async function deleteTest(id: string): Promise<boolean> {
  const testRef = doc(db, TESTS_COLLECTION, id);
  const snapshot = await getDoc(testRef);
  if (!snapshot.exists()) return false;
  
  await deleteDoc(testRef);
  
  // Delete test's results
  const resultsRef = collection(db, RESULTS_COLLECTION);
  const q = query(resultsRef, where('testId', '==', id));
  const resultsSnapshot = await getDocs(q);
  for (const docSnap of resultsSnapshot.docs) {
    await deleteDoc(docSnap.ref);
  }
  
  return true;
}

// Get test without correct answers (for student view)
export async function getTestForStudent(slug: string): Promise<Omit<Test, 'questions'> & { questions: Omit<Test['questions'][0], 'correctAnswer' | 'explanation'>[] } | undefined> {
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

// ---- RESULTS ----
export async function getResults(): Promise<TestResult[]> {
  const resultsRef = collection(db, RESULTS_COLLECTION);
  const snapshot = await getDocs(resultsRef);
  return snapshot.docs.map(doc => doc.data() as TestResult);
}

export async function getResultsByUserId(userId: string): Promise<TestResult[]> {
  const resultsRef = collection(db, RESULTS_COLLECTION);
  const q = query(resultsRef, where('userId', '==', userId));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => doc.data() as TestResult);
}

export async function getResultsByTestId(testId: string): Promise<TestResult[]> {
  const resultsRef = collection(db, RESULTS_COLLECTION);
  const q = query(resultsRef, where('testId', '==', testId));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => doc.data() as TestResult);
}

export async function getResultById(id: string): Promise<TestResult | undefined> {
  const resultRef = doc(db, RESULTS_COLLECTION, id);
  const snapshot = await getDoc(resultRef);
  return snapshot.exists() ? snapshot.data() as TestResult : undefined;
}

export async function createResult(result: TestResult): Promise<void> {
  const resultRef = doc(db, RESULTS_COLLECTION, result.id);
  await setDoc(resultRef, result);
}

export async function deleteResult(id: string): Promise<boolean> {
  const resultRef = doc(db, RESULTS_COLLECTION, id);
  const snapshot = await getDoc(resultRef);
  if (!snapshot.exists()) return false;
  
  await deleteDoc(resultRef);
  return true;
}

// Check if user already submitted this test
export async function hasUserSubmittedTest(userId: string, testId: string): Promise<boolean> {
  const resultsRef = collection(db, RESULTS_COLLECTION);
  const q = query(resultsRef, where('userId', '==', userId), where('testId', '==', testId));
  const snapshot = await getDocs(q);
  return !snapshot.empty;
}

// ---- GRADING (server-side validation) ----
export async function gradeTest(testId: string, answers: Record<string, number>): Promise<{ score: number; total: number; percentage: number }> {
  const test = await getTestById(testId);
  if (!test) throw new Error('Test not found');

  let score = 0;
  const total = test.questions.length;

  test.questions.forEach(q => {
    if (answers[q.id] === q.correctAnswer) {
      score++;
    }
  });

  const percentage = Math.round((score / total) * 100);
  return { score, total, percentage };
}

// Real-time listeners for live updates
export function subscribeToTests(callback: (tests: Test[]) => void) {
  const testsRef = collection(db, TESTS_COLLECTION);
  return onSnapshot(testsRef, (snapshot) => {
    const tests = snapshot.docs.map(doc => doc.data() as Test);
    callback(tests);
  });
}

export function subscribeToResults(callback: (results: TestResult[]) => void) {
  const resultsRef = collection(db, RESULTS_COLLECTION);
  return onSnapshot(resultsRef, (snapshot) => {
    const results = snapshot.docs.map(doc => doc.data() as TestResult);
    callback(results);
  });
}

export function subscribeToUsers(callback: (users: User[]) => void) {
  const usersRef = collection(db, USERS_COLLECTION);
  return onSnapshot(usersRef, (snapshot) => {
    const users = snapshot.docs.map(doc => doc.data() as User);
    callback(users);
  });
}
