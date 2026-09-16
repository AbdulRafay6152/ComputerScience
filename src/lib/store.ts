import { User, Test, TestResult } from '../types';
import { seedTests } from './seed';
import { hashPassword } from './auth';

const USERS_KEY = 'csthub_users';
const TESTS_KEY = 'csthub_tests';
const RESULTS_KEY = 'csthub_results';
const SESSION_KEY = 'csthub_session';
const INIT_KEY = 'csthub_initialized';

// Initialize tests and admin user if not present
async function initializeData(): Promise<void> {
  const initialized = localStorage.getItem(INIT_KEY);
  if (initialized) return;

  // Seed tests
  localStorage.setItem(TESTS_KEY, JSON.stringify(seedTests));

  // Create admin user
  const adminHash = await hashPassword('Rafay123@#');

  const adminUser: User[] = [
    {
      id: 'admin-1',
      name: 'Abdul Rafay Qureshi',
      email: 'abdulrafayqureshi@gmail.com',
      passwordHash: adminHash,
      role: 'admin',
      createdAt: new Date().toISOString(),
    },
  ];

  localStorage.setItem(USERS_KEY, JSON.stringify(adminUser));

  // Initialize empty results
  localStorage.setItem(RESULTS_KEY, JSON.stringify([]));

  localStorage.setItem(INIT_KEY, 'true');
}

// Run initialization and export promise for app startup
export const dataReady = initializeData();

// ---- SESSION ----
export function setSession(userId: string): void {
  localStorage.setItem(SESSION_KEY, userId);
}

export function getSession(): string | null {
  return localStorage.getItem(SESSION_KEY);
}

export function clearSession(): void {
  localStorage.removeItem(SESSION_KEY);
}

// ---- USERS ----
export function getUsers(): User[] {
  const data = localStorage.getItem(USERS_KEY);
  return data ? JSON.parse(data) : [];
}

export function getUserById(id: string): User | undefined {
  return getUsers().find(u => u.id === id);
}

export function getUserByEmail(email: string): User | undefined {
  return getUsers().find(u => u.email.toLowerCase() === email.toLowerCase());
}

export function createUser(user: User): void {
  const users = getUsers();
  users.push(user);
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
  
  // Sync to Firebase
  syncToFirebase('users', user.id, user);
}

export function updateUser(id: string, updates: Partial<Omit<User, 'id' | 'passwordHash'>>): boolean {
  const users = getUsers();
  const index = users.findIndex(u => u.id === id);
  if (index === -1) return false;
  
  users[index] = { ...users[index], ...updates };
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
  
  // Sync to Firebase
  syncToFirebase('users', id, users[index]);
  
  return true;
}

export function deleteUser(id: string): boolean {
  const users = getUsers();
  const filtered = users.filter(u => u.id !== id);
  if (filtered.length === users.length) return false;
  
  localStorage.setItem(USERS_KEY, JSON.stringify(filtered));
  
  // Also delete user's results
  const results = getResults();
  const filteredResults = results.filter(r => r.userId !== id);
  localStorage.setItem(RESULTS_KEY, JSON.stringify(filteredResults));
  
  // Sync to Firebase
  deleteFromFirebase('users', id);
  filteredResults.forEach(r => syncToFirebase('results', r.id, r));
  
  return true;
}

// ---- TESTS ----
export function getTests(): Test[] {
  const data = localStorage.getItem(TESTS_KEY);
  return data ? JSON.parse(data) : [];
}

export function getTestById(id: string): Test | undefined {
  return getTests().find(t => t.id === id);
}

export function getTestBySlug(slug: string): Test | undefined {
  return getTests().find(t => t.slug === slug);
}

export function getTestForStudent(slug: string) {
  const test = getTestBySlug(slug);
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

export function createTest(test: Test): void {
  const tests = getTests();
  tests.push(test);
  localStorage.setItem(TESTS_KEY, JSON.stringify(tests));
  
  // Sync to Firebase
  syncToFirebase('tests', test.id, test);
}

export function updateTest(id: string, updates: Partial<Omit<Test, 'id'>>): boolean {
  const tests = getTests();
  const index = tests.findIndex(t => t.id === id);
  if (index === -1) return false;
  
  tests[index] = { ...tests[index], ...updates };
  localStorage.setItem(TESTS_KEY, JSON.stringify(tests));
  
  // Sync to Firebase
  syncToFirebase('tests', id, tests[index]);
  
  return true;
}

export function deleteTest(id: string): boolean {
  const tests = getTests();
  const filtered = tests.filter(t => t.id !== id);
  if (filtered.length === tests.length) return false;
  
  localStorage.setItem(TESTS_KEY, JSON.stringify(filtered));
  
  // Also delete test's results
  const results = getResults();
  const filteredResults = results.filter(r => r.testId !== id);
  localStorage.setItem(RESULTS_KEY, JSON.stringify(filteredResults));
  
  // Sync to Firebase
  deleteFromFirebase('tests', id);
  filteredResults.forEach(r => syncToFirebase('results', r.id, r));
  
  return true;
}

// ---- RESULTS ----
export function getResults(): TestResult[] {
  const data = localStorage.getItem(RESULTS_KEY);
  return data ? JSON.parse(data) : [];
}

export function getResultsByUserId(userId: string): TestResult[] {
  return getResults().filter(r => r.userId === userId);
}

export function getResultsByTestId(testId: string): TestResult[] {
  return getResults().filter(r => r.testId === testId);
}

export function getResultById(id: string): TestResult | undefined {
  return getResults().find(r => r.id === id);
}

export function createResult(result: TestResult): void {
  const results = getResults();
  results.push(result);
  localStorage.setItem(RESULTS_KEY, JSON.stringify(results));
  
  // Sync to Firebase
  syncToFirebase('results', result.id, result);
}

export function deleteResult(id: string): boolean {
  const results = getResults();
  const filtered = results.filter(r => r.id !== id);
  if (filtered.length === results.length) return false;
  
  localStorage.setItem(RESULTS_KEY, JSON.stringify(filtered));
  
  // Sync to Firebase
  deleteFromFirebase('results', id);
  
  return true;
}

export function hasUserSubmittedTest(userId: string, testId: string): boolean {
  return getResults().some(r => r.userId === userId && r.testId === testId);
}

export function gradeTest(testId: string, answers: Record<string, number>): { score: number; total: number; percentage: number } {
  const test = getTestById(testId);
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

// ---- FIREBASE SYNC ----
function syncToFirebase(collection: string, id: string, data: any) {
  import('./firebaseStore').then(({ saveToFirebase }) => {
    saveToFirebase(collection, id, data).catch(err => {
      console.error(`Failed to sync ${collection}/${id} to Firebase:`, err);
    });
  }).catch(() => {});
}

function deleteFromFirebase(collection: string, id: string) {
  import('./firebaseStore').then(({ deleteFromFirebase }) => {
    deleteFromFirebase(collection, id).catch(err => {
      console.error(`Failed to delete ${collection}/${id} from Firebase:`, err);
    });
  }).catch(() => {});
}

// Pull data from Firebase to localStorage
export async function syncFromFirebase() {
  try {
    const { getAll } = await import('./firebaseStore');
    
    const [tests, users, results] = await Promise.all([
      getAll('tests'),
      getAll('users'),
      getAll('results'),
    ]);

    if (tests.length > 0) {
      localStorage.setItem(TESTS_KEY, JSON.stringify(tests));
    }
    if (users.length > 0) {
      localStorage.setItem(USERS_KEY, JSON.stringify(users));
    }
    if (results.length > 0) {
      localStorage.setItem(RESULTS_KEY, JSON.stringify(results));
    }

    console.log(`✅ Synced from Firebase: ${tests.length} tests, ${users.length} users, ${results.length} results`);
  } catch (e) {
    console.error('❌ Sync from Firebase failed:', e);
  }
}
