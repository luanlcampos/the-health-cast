// model/users/UserData.js

export class UserData {
    /**
     * User data constructor
     * @param {string} id - user id
     * @param {string} firstName - user first name
     * @param {string} lastName - user last name
     * @param {string} email - user email
     * @param {string} requestedHcp - user requested hcp
     * @param {string} hcpOrg - user hcp org
     * @param {string} hcpProfession - user hcp profession
     * @param {string} hcpSpecialty - user hcp specialty
     * @param {boolean} isHcp - user is hcp
     * @param {Array} interests - user interests
     * @param {Array} following - user following
     * @param {Date} createdAt - user created at
     * @param {Date} updatedAt - user updated at
     * @param {string} permission - user permission
     */
    constructor(userData) {
        this.firstName = userData.firstName;
        this.lastName = userData.lastName;
        this.email = userData.email;
        this.requestedHcp = userData.requestedHcp;
        this.hcpOrg = userData.hcpOrg;
        this.hcpProfession = userData.hcpProfession;
        this.hcpSpecialty = userData.hcpSpecialty;
        this.isHcp = userData.isHcp;
        this.interests = userData.interests;
        this.following = userData.following;
        this.createdAt = userData.createdAt;
        this.updatedAt = userData.updatedAt;
        this.permission = userData.permission;
    }
}