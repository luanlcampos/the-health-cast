// pages/api/sendNotifications.js

import { firestore } from "firebase-admin";
import { adminDb, adminAuth } from "../../firebase/admin";


// This endpoint is used to send a notification to users that follow a HCP that triggers the notification.
// The notifications are triggered when the HCP schedules a live session, or when the HCP start a new thread.
export default async function handler(req, res) {
    try {
        // get id token from request header
        // the id token should be sent in the request header and get by using the getToken method
        // https://firebase.google.com/docs/auth/admin/verify-id-tokens
        const idToken = req.headers.authorization;

        if (!idToken) {
            res.status(401).json({
                message: "Unauthorized"
            });
            return;
        }

        // verify id token
        const decodedToken = await adminAuth.verifyIdToken(idToken);
        console.log("decoded token: ", decodedToken)
        // get the usersId from the body
        const usersId = req.body.usersId;

        // get the HCP id from decoded token
        const hcpId = decodedToken.user_id;

        // loop through the usersId array
        for (let i = 0; i < usersId.length; i++) {
            // get the user id from the array
            const userId = usersId[i];

            // populate the notification object
            const notification = {
                userId: userId,
                hcpId: hcpId,
                hcpName: req.body.hcpName,
                type: req.body.type,
                message: req.body.message,
                // link to the thread or live session
                link: req.body.link,
                timestamp: firestore.Timestamp.now(),
                seen: false
            }

            // push the notification to the notifications subcollection for the userId[i]
            await adminDb.collection("users").doc(userId).collection("notifications").add(notification);
        }

        // return the success response
        return res.status(200).json({ message: "Notification sent" });
    } catch (error) {
        console.warn(error);
        res.status(401).json({ error: 'Unauthorized' });

    }
}
