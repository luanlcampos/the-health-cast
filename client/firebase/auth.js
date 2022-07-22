import React, { useState, useEffect, useContext, createContext } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { onAuthStateChanged, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from './clientApp';
import { getDoc, doc } from 'firebase/firestore';
import { FBAuthUser } from "@/model/users/FBAuthUser";
import { AdminData } from "@/model/users/AdminData";
import { UserData } from "@/model/users/UserData";
import nookies from 'nookies';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [userData, setUserData] = useState(null);
    const [adminData, setAdminData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    console.log('AuthProvider: user', user);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (data) => {
            setIsLoading(true);
            if (data) {
                const token = await data.getIdToken(true);
                nookies.set(undefined, 'token', token, { path: '/' });
                setUser(new FBAuthUser(data));
                const fetchUser = async () => {
                    const docRef = doc(db, 'users', data.uid);
                    const result = await getDoc(docRef);
                    if (result.exists()) {
                        // setUserData(result.data());
                        setUserData(new UserData(result.data()));
                    } else {
                        console.log('User does not exist on Firestore');
                        // search on admin db  
                        const adminDocRef = doc(db, 'admin', data.uid);
                        const adminResult = await getDoc(adminDocRef);
                        if (adminResult.exists()) {
                            setAdminData(new AdminData(adminResult.data()));
                            // setAdminData(adminResult.data());
                            console.log('AuthProvider: adminData', adminData);
                        } else {
                            console.log('User does not exist on admin db');

                            // logout user
                            auth.signOut();
                            window.location.reload();
                        }
                        setUserData(null);
                    }
                }
                fetchUser();

            } else {
                setUser(null);
                setIsLoading(false);
                nookies.set(undefined, 'token', '', { path: '/' });
            }
            setIsLoading(false);
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

    // remove user from auth
    const removeUser = async () => {
        const user = auth.currentUser;
        if (user) {
            await user.delete();
            setUser(null);
        }
    };

    return (
        <AuthContext.Provider value={{ user, userData, adminData, login, logout, signup, removeUser }}>{isLoading ? null : children}</AuthContext.Provider>
    )
};

