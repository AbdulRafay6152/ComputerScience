import { initializeApp, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getAuth, Auth } from 'firebase/auth';

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBt2xroLTdlvU-4r6H01W0BHwUc0Axy_FA",
  authDomain: "testine-893c0.firebaseapp.com",
  databaseURL: "https://testine-893c0-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "testine-893c0",
  storageBucket: "testine-893c0.firebasestorage.app",
  messagingSenderId: "114860772912",
  appId: "1:114860772912:web:a9586d76394faaa340e7f5"
};

// Initialize Firebase with error handling
let app: FirebaseApp;
let db: Firestore;
let auth: Auth;

try {
  app = initializeApp(firebaseConfig);
  db = getFirestore(app);
  auth = getAuth(app);
  console.log('✅ Firebase initialized successfully');
} catch (error) {
  console.error('❌ Firebase initialization error:', error);
  throw error;
}

// Initialize Firestore and Auth
export { db, auth };
export default app;
