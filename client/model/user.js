// /model/user.js
import { setDoc, doc, updateDoc, arrayUnion } from "firebase/firestore";
import { db } from "/firebase/clientApp";
// class to represent a user
class User {
    constructor(id, firstName, lastName, email, requestedHcp, hcpOrg = '', hcpProfession = '', hcpSpecialy = '', isHcp = false, interests = [], following = []) {
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        // TODO: add more data to hcp users
        this.isHcp = isHcp; // always false, just turned true by admin
        this.requestedHcp = requestedHcp; // refers to the user requesting to be a hcp

        // checks if user select org in case they requested to be a hcp
        if (requestedHcp && !hcpOrg) {
            console.error('HCP user created without hcpOrg');
            throw new Error('HCP must have an organization');
        }
        this.hcpOrg = hcpOrg.orgId;
        this.hcpProfession = hcpProfession;
        this.hcpSpecialy = hcpSpecialy;
        /**
         * set hcp permissions
         * All: can start lives and manage threads
         * Forum: can only manage threads
         * Lives: can only start lives
         * None: can not manage anything. Will have the same permissions as an user
         * @Note by default, permission is set to None. Whenever the admin accepts the request, 
         * the permission will be set to All.
         * */
        this.permission = 'None';
        this.interests = interests;
        // Users following list. It is a list containing the users id
        this.following = following;
        this.createdAt = new Date();
        this.updatedAt = new Date();
    }

    // save the user to the database
    async save() {
        try {
            // create a new user document in the users collection
            console.log('saving user', this);
            await setDoc(doc(db, "users", this.id), {
                firstName: this.firstName,
                lastName: this.lastName,
                email: this.email,
                requestedHcp: this.requestedHcp,
                isHcp: false,
                hcpOrg: this.hcpOrg,
                hcpProfession: this.hcpProfession,
                hcpSpecialty: this.hcpSpecialy,
                interests: this.interests,
                following: this.following,
                createdAt: this.createdAt,
                updatedAt: this.updatedAt,
            });

            // send request to be hcp to the admin
            if (this.requestedHcp) {
                const newRequest = {
                    userId: this.id,
                    firstName: this.firstName,
                    lastName: this.lastName,
                    email: this.email
                }
                await updateDoc(doc(db, "admin", String(this.hcpOrg)), {
                    requests: arrayUnion(newRequest),
                });
            }
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    // TODO: add functions to update user data
}

module.exports.User = User;
