import React, { createContext, useContext, useEffect, useState } from "react";
import { 
  User as FirebaseUser, 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  signOut, 
  createUserWithEmailAndPassword,
  updateProfile,
  sendPasswordResetEmail
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "../firebase/config";
import { UserProfile } from "../types";

// Firestore error helper as mandated by firebase-integration skill
enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

interface AuthContextType {
  currentUser: FirebaseUser | null;
  userProfile: UserProfile | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string, role: "credit_officer" | "msme_owner" | "administrator", company: string) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateUserProfile: (data: Partial<UserProfile>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch or create a Firestore profile for the authenticated user
  const fetchUserProfile = async (firebaseUser: FirebaseUser): Promise<UserProfile | null> => {
    const path = `users/${firebaseUser.uid}`;
    try {
      const userDocRef = doc(db, "users", firebaseUser.uid);
      const userDocSnap = await getDoc(userDocRef);

      if (userDocSnap.exists()) {
        return userDocSnap.data() as UserProfile;
      } else {
        // Fallback: If no document exists in Firestore, create a default profile
        const defaultProfile: UserProfile = {
          uid: firebaseUser.uid,
          email: firebaseUser.email || "",
          name: firebaseUser.displayName || "User Profile",
          role: firebaseUser.email?.includes("bank") ? "credit_officer" : "msme_owner",
          company: firebaseUser.email?.includes("bank") ? "MSME Development Bank" : "MSME Enterprise Ltd",
          createdAt: new Date().toISOString(),
        };
        try {
          await setDoc(userDocRef, defaultProfile);
        } catch (err) {
          handleFirestoreError(err, OperationType.WRITE, path);
        }
        return defaultProfile;
      }
    } catch (error) {
      console.error("Error fetching user profile from Firestore:", error);
      // If it is a permission/firestore error, handle it properly
      if (error instanceof Error && (error.message.includes("permission") || error.message.includes("insufficient"))) {
        handleFirestoreError(error, OperationType.GET, path);
      }
      // Return a temporary state to avoid blocking if Firestore rules/network fails
      return {
        uid: firebaseUser.uid,
        email: firebaseUser.email || "",
        name: firebaseUser.displayName || "User Profile",
        role: "credit_officer", // Default role for local exploration
        company: "MSME Development Bank",
        createdAt: new Date().toISOString(),
      };
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setLoading(true);
      setCurrentUser(user);
      if (user) {
        const profile = await fetchUserProfile(user);
        setUserProfile(profile);
      } else {
        setUserProfile(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  const signup = async (
    email: string, 
    password: string, 
    name: string, 
    role: "credit_officer" | "msme_owner" | "administrator", 
    company: string
  ) => {
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Update displayName in auth state
      await updateProfile(user, { displayName: name });

      // Create detailed user profile in Firestore
      const newProfile: UserProfile = {
        uid: user.uid,
        email,
        name,
        role,
        company,
        createdAt: new Date().toISOString(),
      };

      const path = `users/${user.uid}`;
      try {
        await setDoc(doc(db, "users", user.uid), newProfile);
      } catch (err) {
        handleFirestoreError(err, OperationType.WRITE, path);
      }
      setUserProfile(newProfile);
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await signOut(auth);
      setCurrentUser(null);
      setUserProfile(null);
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (email: string) => {
    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
    } finally {
      setLoading(false);
    }
  };

  const updateUserProfile = async (data: Partial<UserProfile>) => {
    if (!currentUser || !userProfile) throw new Error("No authenticated user");
    
    const updatedProfile = { ...userProfile, ...data };
    const path = `users/${currentUser.uid}`;
    try {
      await setDoc(doc(db, "users", currentUser.uid), updatedProfile, { merge: true });
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, path);
    }
    setUserProfile(updatedProfile);
  };

  const value = {
    currentUser,
    userProfile,
    loading,
    login,
    signup,
    logout,
    resetPassword,
    updateUserProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return context;
};
