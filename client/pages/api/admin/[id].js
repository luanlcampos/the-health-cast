// pages/api/fbAdmin.js

import { adminDb, adminAuth } from "../../../firebase/admin";

// GET /api/admin/[id]
export default async function handler(req, res) {
    console.log(req.query);
    const { id } = req.query;
    console.log(id);
    try {
        // get id token from request header
        // the id token should be sent in the request header and get by using the getToken method
        // https://firebase.google.com/docs/auth/admin/verify-id-tokens
        const idToken = req.headers.authorization;
        console.log(idToken);

        // verify id token
        const decodedToken = await adminAuth.verifyIdToken(idToken);
        // get all users from the database
        const adminRef = adminDb.collection("admin").doc(id);
        const admin = await adminRef.get();
        if (!admin.exists) {
            res.status(404).json(null);
            return;
        }
        const adminData = { ...admin.data(), id: admin.id };
        res.status(200).json(adminData);
    } catch (error) {
        console.warn(error.message);
        res.status(401).json({ error: 'Unauthorized' });

    }


}
