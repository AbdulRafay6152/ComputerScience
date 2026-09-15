export interface User {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: 'student' | 'admin';
  createdAt: string;
}

export interface Question {
  id: string;
  testId: string;
  text: string;
  options: string[];
  correctAnswer: number; // index of correct option
  explanation?: string;
}

export interface Test {
  id: string;
  title: string;
  slug: string;
  description: string;
  category: string;
  difficulty: string;
  questions: Question[];
}

export interface TestResult {
  id: string;
  userId: string;
  testId: string;
  score: number;
  total: number;
  percentage: number;
  answers: Record<string, number>; // questionId -> selected option index
  submittedAt: string;
}

export interface AuthState {
  user: Omit<User, 'passwordHash'> | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}
