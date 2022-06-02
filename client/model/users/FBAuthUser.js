// model/users/FBAuthUser.js
class FBAuthUser {
    /**
     * FBAuthUser constructor that contains many properties
     * More used:
     * @param {string} uid - user uid
     * @param {string} displayName - user display name
     * @param {string} email - user email
     * @param {boolean} emailVerified - user email verified
     * @param {Object<UserMetadata>} metadata - user metadata with createdAt, creationAt, and lastLoginInTime
     * @param {Object} reloadUserInfo - user reloadUserInfo
     * @param {Object<StsTokenManager>} stsTokenManager - user stsTokenManager with accessToken, refreshToken, expirationTime, and isExpired
    */
    constructor(userData) {
        console.log('FBAuthUser constructor', userData);
        Object.assign(this, userData);
    };
}

module.exports.FBAuthUser = FBAuthUser;