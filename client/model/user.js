// /model/user.js
import { setDoc, doc, updateDoc, arrayUnion } from "firebase/firestore";
import { db } from "/firebase/clientApp";
// class to represent a user input

class User {
    /**
     * User constructor
     * @param {FirebaseId} id - get from firebase auth 
     * @param {string} firstName 
     * @param {string} lastName 
     * @param {string} email 
     * @param {boolean} requestedHcp 
     * @param {Object} hcpOrg - contains orgId and orgName 
     * @param {string} hcpProfession - from a list of certified professionals
     * @param {string} hcpSpecialty optional
     * @param {boolean} isHcp - false by default, set to true if the admin approves
     * @param {Array} interests - list of health topics
     * @param {Array<string>} following - list of following userIds
     */
    constructor(id, firstName, lastName, email, requestedHcp, hcpOrg = '', hcpProfession = '', hcpSpecialty = '', isHcp = false, interests = [], following = []) {
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.isHcp = isHcp;
        this.requestedHcp = requestedHcp;
        // checks if user select org in case they requested to be a hcp
        if (requestedHcp && !hcpOrg) {
            console.error('HCP user created without hcpOrg');
            throw new Error('HCP must have an organization');
        }
        this.hcpOrg = hcpOrg;
        this.hcpProfession = hcpProfession;
        this.hcpSpecialty = hcpSpecialty;
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
        this.following = following;
        this.followers = [];
        this.createdAt = new Date();
        this.updatedAt = new Date();
        // default user bio
        this.biography = 'Hello World! 😄';
    }

    // save the user to the database
    async save() {
        try {
            // create a new user document in the users collection
            console.log('saving user', this);
            const res = await setDoc(doc(db, "users", this.id), {
                firstName: this.firstName,
                lastName: this.lastName,
                email: this.email,
                requestedHcp: this.requestedHcp,
                isHcp: false,
                hcpOrg: this.hcpOrg,
                hcpProfession: this.hcpProfession,
                hcpSpecialty: this.hcpSpecialty,
                interests: this.interests,
                following: this.following,
                followers: this.followers,
                createdAt: this.createdAt,
                updatedAt: this.updatedAt,
                biography: this.biography,
            });

            console.log(res);

            // send request to be hcp to the admin
            if (this.requestedHcp) {
                const newRequest = {
                    userId: this.id,
                    firstName: this.firstName,
                    lastName: this.lastName,
                    email: this.email
                }
                await updateDoc(doc(db, "admin", String(this.hcpOrg.orgId)), {
                    requests: arrayUnion(newRequest),
                });
            }
        } catch (error) {
            console.error(error);
            throw new Error(error);
        }
    }
}

module.exports.User = User;
