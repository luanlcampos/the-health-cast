import { initializeApp, getApp } from "firebase-admin/app";
import { cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from 'firebase-admin/firestore';

const serviceAccount = require("./adminSecrets.json");

// try to see if the app already exists, if not, create it
// avoid creating the app twice by frontend and backend
try {
    getApp();
} catch (error) {
    console.info('App not initialized, initializing...');
    initializeApp({
        credential: cert(serviceAccount)
    });
}

const adminAuth = getAuth();
const adminDb = getFirestore(getApp());

export { adminAuth, adminDb };





