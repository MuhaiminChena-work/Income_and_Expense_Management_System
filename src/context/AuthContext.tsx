import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { auth, googleProvider, signInWithPopup, signOut, db, handleFirestoreError, OperationType, testConnection } from '../firebase';
import { UserProfile } from '../types';

interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  authError: string | null;
  signInWithGoogle: () => Promise<void>;
  signOutUser: () => Promise<void>;
  updateMonthlyBudget: (amount: number) => Promise<void>;
  clearAuthError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    // Run connection test on app boot
    testConnection();

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        try {
          const userDocRef = doc(db, 'users', currentUser.uid);
          const snap = await getDoc(userDocRef);
          if (snap.exists()) {
            setUserProfile(snap.data() as UserProfile);
          } else {
            const initialProfile: UserProfile = {
              userId: currentUser.uid,
              email: currentUser.email || '',
              displayName: currentUser.displayName || 'ผู้ใช้งาน',
              photoURL: currentUser.photoURL || '',
              monthlyBudget: 25000,
              currency: 'THB',
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            };
            await setDoc(userDocRef, initialProfile);
            setUserProfile(initialProfile);
          }
        } catch (err) {
          console.error('Error fetching user profile:', err);
          // Non-blocking fallback profile
          setUserProfile({
            userId: currentUser.uid,
            email: currentUser.email || '',
            displayName: currentUser.displayName || 'ผู้ใช้งาน',
            photoURL: currentUser.photoURL || '',
            monthlyBudget: 25000,
            currency: 'THB',
          });
        }
      } else {
        setUserProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    setAuthError(null);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const loggedUser = result.user;
      const userDocRef = doc(db, 'users', loggedUser.uid);
      try {
        const snap = await getDoc(userDocRef);
        if (!snap.exists()) {
          const newProfile: UserProfile = {
            userId: loggedUser.uid,
            email: loggedUser.email || '',
            displayName: loggedUser.displayName || 'ผู้ใช้งาน',
            photoURL: loggedUser.photoURL || '',
            monthlyBudget: 25000,
            currency: 'THB',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };
          await setDoc(userDocRef, newProfile);
          setUserProfile(newProfile);
        } else {
          setUserProfile(snap.data() as UserProfile);
        }
      } catch (dbErr) {
        handleFirestoreError(dbErr, OperationType.WRITE, `users/${loggedUser.uid}`);
      }
    } catch (err: unknown) {
      const errCode = (err as any)?.code || '';
      const message = err instanceof Error ? err.message : String(err);
      
      // If user intentionally closed or cancelled the popup, do not treat as application error
      if (errCode === 'auth/popup-closed-by-user' || errCode === 'auth/cancelled-popup-request' || message.includes('popup-closed-by-user')) {
        console.info('Google sign-in was cancelled by user closing the popup window.');
        return;
      }

      console.error('Google sign-in error:', err);
      setAuthError(message);
    }
  };

  const signOutUser = async () => {
    try {
      await signOut(auth);
      setUser(null);
      setUserProfile(null);
    } catch (err) {
      console.error('Sign out error:', err);
    }
  };

  const updateMonthlyBudget = async (amount: number) => {
    if (!user) return;
    const path = `users/${user.uid}`;
    try {
      const userDocRef = doc(db, 'users', user.uid);
      await updateDoc(userDocRef, {
        monthlyBudget: amount,
        updatedAt: new Date().toISOString(),
      });
      setUserProfile(prev => prev ? { ...prev, monthlyBudget: amount } : null);
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, path);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        userProfile,
        loading,
        authError,
        signInWithGoogle,
        signOutUser,
        updateMonthlyBudget,
        clearAuthError: () => setAuthError(null),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
