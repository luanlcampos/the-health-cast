import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from "firebase/firestore";

// Initialize Firebase 
const firebaseConfig = {
    apiKey: "AIzaSyAuXwscCDilSsEpYp1s3cmTw_WwW37fO2M",
    authDomain: "authtest-5cf01.firebaseapp.com",
    databaseURL: "https://authtest-5cf01-default-rtdb.firebaseio.com",
    projectId: "authtest-5cf01",
    storageBucket: "authtest-5cf01.appspot.com",
    messagingSenderId: "359624060438",
    appId: "1:359624060438:web:86c01e1dff1585f93f0f37"
}

// export default function firebaseClient() {
// if (!getApps().length) {
//     const app = initializeApp(firebaseConfig);
// }
const app = initializeApp(firebaseConfig);
// }

// const app = initializeApp(firebaseConfig);
export const auth = getAuth();

// Initialize firebase auth
// const auth = firebase.auth(app);
// export default Firebase;
export const db = getFirestore(app);
