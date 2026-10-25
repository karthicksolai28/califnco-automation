import React, { createContext, useContext, useState, useEffect } from 'react';
import { onAuthStateChanged, User, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { authInstance, db } from '@/firebase';

interface AuthContextType {
  user: User | null;
  role: 'customer' | 'dealer' | 'admin' | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, role: 'customer' | 'dealer') => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<'customer' | 'dealer' | 'admin' | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('AuthContext useEffect running');
    const unsubscribe = onAuthStateChanged(authInstance, async (user) => {
      console.log('AuthContext onAuthStateChanged, user:', user?.email);
      if (user) {
        setUser(user);
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        console.log('User doc exists:', userDoc.exists());
        if (userDoc.exists()) {
          const userData = userDoc.data();
          console.log('User role:', userData.role);
          setRole(userData.role);
        } else {
          // Auto-create user document if missing
          await setDoc(doc(db, 'users', user.uid), {
            email: user.email,
            role: 'customer', // Default role
            createdAt: new Date().toISOString(),
          });
          setRole('customer');
          console.log('Auto-created user document with customer role');
        }
      } else {
        setUser(null);
        setRole(null);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const login = async (email: string, password: string) => {
    console.log('AuthContext login called');
    await signInWithEmailAndPassword(authInstance, email, password);
    console.log('AuthContext login completed');
  };

  const signup = async (email: string, password: string, userRole: 'customer' | 'dealer' | 'admin') => {
    const userCredential = await createUserWithEmailAndPassword(authInstance, email, password);
    await setDoc(doc(db, 'users', userCredential.user.uid), {
      email,
      role: userRole,
      createdAt: new Date().toISOString(),
    });
  };

  const logout = async () => {
    await signOut(authInstance);
  };

  return (
    <AuthContext.Provider value={{ user, role, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
