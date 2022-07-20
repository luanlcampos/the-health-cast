// pages/api/fbAdmin.js

import { adminDb, adminAuth } from "../../firebase/admin";

// This is a test file that retrieves all the users from the ''users'' collection in the Firestore database.
// The data is returned as a JSON object.

export default async function handler(req, res) {
    try {
        // get id token from request header
        // the id token should be sent in the request header and get by using the getToken method
        // https://firebase.google.com/docs/auth/admin/verify-id-tokens
        const idToken = req.headers.authorization;
        // const idToken = "eyJhbGciOiJSUzI1NiIsImtpZCI6ImVmMzAxNjFhOWMyZGI3ODA5ZjQ1MTNiYjRlZDA4NzNmNDczMmY3MjEiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vYXV0aHRlc3QtNWNmMDEiLCJhdWQiOiJhdXRodGVzdC01Y2YwMSIsImF1dGhfdGltZSI6MTY1MTU1MDUxMywidXNlcl9pZCI6IjVJcHQ4TEdJdWxOUEY4WEdncUlHYTJ5WEhWMDIiLCJzdWIiOiI1SXB0OExHSXVsTlBGOFhHZ3FJR2EyeVhIVjAyIiwiaWF0IjoxNjUxNTUwNTEzLCJleHAiOjE2NTE1NTQxMTMsImVtYWlsIjoibHVhbmxpbWFfMTBAaG90bWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6ZmFsc2UsImZpcmViYXNlIjp7ImlkZW50aXRpZXMiOnsiZW1haWwiOlsibHVhbmxpbWFfMTBAaG90bWFpbC5jb20iXX0sInNpZ25faW5fcHJvdmlkZXIiOiJwYXNzd29yZCJ9fQ.pajCduxUPjSELMTJ3KLqz6be7JLAByRiwwbA3q2B9tzWhHivhhIlj0Q0eO3n2UwagIM1k_kYCv2cCVm8z3ItLXVIDjm3uU1niKa_0R9HX5fcU0dCcJv6tVL4KsboYDRznSi_BzZBi2QZXb1HLCU-mDKvwzCfcm1CoPor-7y_aYyqL0UcEeu2qQr_0Yvx1emvcA_UMUI8qBDCtyn_xBWdwxz_NDRkk_KNZJ9oduVOdyXObi53b-jopJQhqr2LlYt3wf0LPeKVCHPJ3kfqWGlsYjR_trnJW-emsnzaO83f7ZrutBgcQho2DSIkHKFT62Aq-m7iaq0Y7mHpfwpw9IEp7w";
        if (!idToken) {
            res.status(401).json({
                message: "Unauthorized"
            });
            return;
        }

        // verify id token
        const decodedToken = await adminAuth.verifyIdToken(idToken);
        // get all users from the database
        const users = await adminDb.collection("users").get();
        const usersArray = users.docs.map((doc) => {
            return { ...doc.data(), id: doc.id }
        });
        res.status(200).json(usersArray);
    } catch (error) {
        console.warn(error.message);
        res.status(401).json({ error: 'Unauthorized' });

    }


}
