// model/users/UserData.js

export class UserData {
  /**
   * User data constructor
   * @param {string} id - user id
   * @param {string} firstName - user first name
   * @param {string} lastName - user last name
   * @param {string} email - user email
   * @param {boolean} isHcp - user is hcp
   * @param {string} requestedHcp - user requested hcp
   * @param {string} hcpOrg - user hcp org
   * @param {string} hcpProfession - user hcp profession
   * @param {string} hcpSpecialty - user hcp specialty
   * @param {string} permission - user permission
   * @param {Array} interests - user interests
   * @param {Array} following - user following
   * @param {Array} followers - user followers
   * @param {Date} createdAt - user created at
   * @param {Date} updatedAt - user updated at
   * @param {string} biography - user biography
   * @param {Date} firstMonthlyReportDate - user updated at
   * @param {Date} totalNumberReports - user updated at
   */
  constructor(userData) {
    // General user data
    this.firstName = userData.firstName;
    this.lastName = userData.lastName;
    this.email = userData.email;
    // HCP related fields
    this.isHcp = userData.isHcp;
    this.requestedHcp = userData.requestedHcp;
    this.hcpOrg = userData.hcpOrg;
    this.hcpProfession = userData.hcpProfession;
    this.hcpSpecialty = userData.hcpSpecialty;
    this.permission = userData.permission;
    // User related fields
    this.interests = userData.interests;
    this.following = userData.following;
    this.followers = userData.followers;
    this.createdAt = userData.createdAt;
    this.updatedAt = userData.updatedAt;
    this.biography = userData.biography;
    this.firstMonthlyReportDate = userData.createdAt;
    this.totalNumberReports = userData.totalNumberReports;
  }
}