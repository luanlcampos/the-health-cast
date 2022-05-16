// /model/user.js
import { setDoc, doc } from "firebase/firestore";
import { db } from "/firebase/clientApp";
// class to represent a user
class User {
    constructor(id, firstName, lastName, email, isHcp = false, hcpOrg = '', interests = []) {
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        // TODO: add more data to hcp users
        this.isHcp = isHcp;
        if (isHcp && !hcpOrg) {
            console.error('HCP user created without hcpOrg');
            throw new Error('HCP must have an organization');
        }
        this.hcpOrg = hcpOrg;
        this.interests = interests;
        this.createdAt = new Date();
        this.updatedAt = new Date();
    }

    // save the user to the database
    async save() {
        try {
            // create a new user document in the users collection
            await setDoc(doc(db, "users", this.id), {
                firstName: this.firstName,
                lastName: this.lastName,
                email: this.email,
                isHcp: this.isHcp,
                hcpOrg: this.hcpOrg,
                interests: this.interests,
                createdAt: this.createdAt,
                updatedAt: this.updatedAt,
            });
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    // TODO: add functions to update user data
}

module.exports.User = User;
