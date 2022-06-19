// model/users/reportData.js
import { setDoc, doc, updateDoc, arrayUnion } from "firebase/firestore";
import { db } from "@/firebase/clientApp";

// to generate uid for a submitted report
import { nanoid } from "nanoid";

class ReportData {
  /**
   * User data constructor
   * @param {string} id - report id //{FirebaseId}
   * @param {string} reportingAccountId - reporting user who created the report
   * @param {string} reportedAccountId - reported user who is being reported
   * @param {string} reportedAccountOrg - if reported user is an HCP, include the organization it belongs to
   * @param {string} reportedSrc - id to the source of the report (ie. reported user profile -> reported user id; reported live session -> reported live session id; reported thread -> reported thread id)
   * @param {string} reportReason - report reason
   * @param {string} reportDetails - additional details on report
   * @param {Date} createdAt - report created at
   * @param {Date} updatedAt - report updated at
   */
  constructor(
    // id,
    reportingAccountId,
    reportedAccountId,
    reportedAccountOrg,
    reportedSrc,
    reportReason,
    reportDetails
  ) {
    this.id = nanoid();
    this.reportingAccountId = reportingAccountId;
    this.reportedAccountId = reportedAccountId;
    this.reportedAccountOrg = reportedAccountOrg;
    this.reportedSrc = reportedSrc;
    this.reportReason = reportReason;
    this.reportDetails = reportDetails;
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  async save() {
    try {
      // create a new user document in the users collection
      console.log("saving report to fb", this);
      const res = await setDoc(doc(db, "reports", this.id), {
        reportingAccountId: this.reportingAccountId,
        reportedAccountId: this.reportedAccountId,
        reportedAccountOrg: this.reportedAccountOrg,
        reportedSrc: this.reportedSrc,
        reportReason: this.reportReason,
        reportDetails: this.reportDetails,
        createdAt: this.createdAt,
        updatedAt: this.updatedAt,
      });

      console.log(res);
    } catch (error) {
      console.error(error);
      throw new Error(error);
    }
  }
}

module.exports.Report = ReportData;
