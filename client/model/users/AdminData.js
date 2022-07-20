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
     * @param {Array} following - array of following users
     * @param {Array} followers - array of followers users
    */
    constructor(adminData) {
        this.alerts = adminData.alerts;
        this.hcpList = adminData.hcpList;
        this.institution = adminData.institution;
        this.orgId = adminData.orgId;
        this.requests = adminData.requests;
        this.following = adminData.following;
        this.followers = adminData.followers;
    }
}
// get admin data
export const getAdminData = async (id, token) => {
    try {
        // Vercel exposes some variables in the environment by default. See more at:
        // https://vercel.com/docs/concepts/projects/environment-variables#system-environment-variables
        const baseUrl = process.env.NODE_ENV === 'production' ? process.env.VERCEL_URL : 'http://localhost:3000';
        const url = `${baseUrl}/api/admin/${id}`;

        const res = await fetch(url, {
            method: "GET",
            headers: {
                'Authorization': `${token}`,
            }
        });
        const data = await res.json();
        return data;
    } catch (error) {
        console.warn(error.message);
        return null;
    }
}