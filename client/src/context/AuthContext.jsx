import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth } from '../firebase';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from 'firebase/auth';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser({
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          name: firebaseUser.displayName || firebaseUser.email,
          role: firebaseUser.email?.includes('admin') ? 'admin' :
                firebaseUser.email?.includes('tech') ? 'technician' : 'student',
        });
      } else {
        setUser(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const login = async (identifier, password) => {
    try {
      const email = identifier.includes('@') ? identifier : identifier + '@campus.edu';
      const result = await signInWithEmailAndPassword(auth, email, password);
      const firebaseUser = result.user;
      const role = email.includes('admin') ? 'admin' :
                   email.includes('tech') ? 'technician' : 'student';
      const userData = { uid: firebaseUser.uid, email, role, name: firebaseUser.displayName || email };
      setUser(userData);
      return { success: true, user: userData };
    } catch (err) {
      return { success: false, message: err.message || 'Invalid credentials' };
    }
  };

  const register = async (userData) => {
    try {
      const email = userData.email || (userData.rollNo || userData.name) + '@campus.edu';
      const result = await createUserWithEmailAndPassword(auth, email, userData.password);
      const firebaseUser = result.user;
      const newUser = {
        uid: firebaseUser.uid,
        email,
        name: userData.name,
        role: userData.role || 'student',
        rollNo: userData.rollNo,
        department: userData.department,
        assignedLab: userData.assignedLab,
        assignedPc: userData.assignedPc,
      };
      setUser(newUser);
      return { success: true, user: newUser };
    } catch (err) {
      return { success: false, message: err.message || 'Registration failed' };
    }
  };

  const logout = async () => {
    await signOut(auth);
    setUser(null);
  };

  const demoLogin = async (roleType) => {
    if (roleType === 'admin') return await login('admin@campus.edu', 'Admin@123');
    if (roleType === 'tech') return await login('tech@campus.edu', 'Tech@123');
    if (roleType === 'student2') return await login('CS-2022-018@campus.edu', 'Student@123');
    return await login('CS-2022-042@campus.edu', 'Student@123');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        demoLogin,
        isAdmin: user?.role === 'admin' || user?.role === 'technician',
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
