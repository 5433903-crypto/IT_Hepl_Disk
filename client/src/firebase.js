import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyAI3KwBXIiQMA8F4sI8kwIddO91FjEdL80",
  authDomain: "campus-it-helpdesk.firebaseapp.com",
  projectId: "campus-it-helpdesk",
  storageBucket: "campus-it-helpdesk.firebasestorage.app",
  messagingSenderId: "422673456079",
  appId: "1:422673456079:web:9c415444cdbe856f4d50ba"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export default app;
