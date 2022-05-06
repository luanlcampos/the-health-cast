import React, { useState, useEffect, useContext, createContext } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import {
  onAuthStateChanged,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { auth, db } from "./clientApp";
import { getDoc, doc } from "firebase/firestore";
// import { verifyIdToken } from './admin';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (data) => {
      if (data) {
        setUser(data);
        setLoading(false);
        const fetchUser = async () => {
          const docRef = doc(db, "users", data.uid);
          const result = await getDoc(docRef);
          if (result.exists()) {
            setUserData(result.data());
          } else {
            console.log("User does not exist on Firestore");
            setUserData(null);
          }
        };
        fetchUser();
      } else {
        setUser(null);
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, []);

  // login with email and password
  const login = async (email, password) => {
    return await signInWithEmailAndPassword(auth, email, password);
  };

  // sign up with email and password
  const signup = async (email, password) => {
    return await createUserWithEmailAndPassword(auth, email, password);
  };

  // logout
  const logout = () => {
    auth.signOut();
    setUser(null);
    return;
  };

  return (
    <AuthContext.Provider value={{ user, userData, login, logout, signup }}>
      {loading ? null : children}
    </AuthContext.Provider>
  );
};
