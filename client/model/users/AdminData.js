// model/users/AdminData.js

export class AdminData {
    /**
     * Admin data constructor
     * @param {string} id - admin id
     * @param {Array} alerts - array of alerts
     * @param {Array} hcpList - array of approved hcp users
     * @param {string} institution - institution name
     * @param {string} orgId - organization id
     * @param {Array} requests - array of requests to be hcp
    */
    // constructor(id, alerts = [], hcpList = [], institution, orgId, requests = []) {
    //     this.id = id;
    //     this.alerts = [];
    //     // array of hcp ids that are approved in the org
    //     this.hcpList = [];
    //     this.institution = '';
    //     this.orgId = '';
    //     // an array of requests to be hcp
    //     this.requests = [];
    // }

    constructor(adminData) {
        this.alerts = adminData.alerts;
        this.hcpList = adminData.hcpList;
        this.institution = adminData.institution;
        this.orgId = adminData.orgId;
        this.requests = adminData.requests;
    }
}