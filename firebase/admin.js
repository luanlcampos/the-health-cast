var admin = require("firebase-admin");

var serviceAccount = require("./adminSecrets.json");

export const verifyIdToken = (idToken) => {

    if (!admin.apps.length) {
        const adminClient = admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
            databaseURL: "https://authtest-5cf01-default-rtdb.firebaseio.com"
        });
    }

    return admin.auth().verifyIdToken(idToken).catch((error) => {
        console.warn(error);
        throw new Error(error);
    }
    );
}

