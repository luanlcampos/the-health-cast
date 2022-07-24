// /model/liveSession.js
import {
  setDoc,
  doc,
  updateDoc,
  arrayUnion,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "/firebase/clientApp";
import { mediaIDList } from "../../data/mediaIDList";

// model/live sessions/LiveSessionData.js

class LiveSessionData {
  /**
   * live session data constructor
   * @param {string} id - live session id
   * @param {string} mediaId - live session Media id
   * @param {string} title - live session title
   * @param {string} description - live session description
   * @param {Date} sessionScheduleDate - live session scheduled date
   * @param {Date} startTime - live session start timestamp
   * @param {Date} endTime - live session end timestamp
   * @param {number} liveSessionDuration - live session duration
   * @param {boolean} isOngoing - live session is ongoing
   * @param {boolean} isRecording - live session is currently being recorded
   * @param {boolean} isARecording - live session is a recording
   * @param {Array} interests - live session interests
   * @param {Array} reports - live session's report set
   * // Meta data
   * @param {string} createdByHcpId - live session HCP owner
   * @param {Date} createdAt - live session created at
   * @param {Date} updatedAt - live session updated at
   */
  constructor(
    id,
    title,
    description,
    sessionScheduleDate,
    createdByHcpId,
    interests = [],
    isOngoing = false,
    isScheduled = false,
    reports = [],
    mediaId = mediaIDList.liveSession
  ) {
    this.id = id;
    this.mediaId = mediaId;
    this.createdByHcpId = createdByHcpId;
    this.title = title;
    this.description = description;
    this.sessionScheduleDate = sessionScheduleDate;
    this.interests = interests;
    this.reports = reports;
    this.isRecording = false;
    this.isOngoing = isOngoing;
    this.isScheduled = isScheduled;
    this.isARecording = false;
    this.liveSessionDuration = 0;
    this.startTime = "";
    this.endTime = "";
    this.createdAt = serverTimestamp();
    this.updatedAt = serverTimestamp();
  }

  // save the live session to the database
  async save() {
    try {
      // create a new live session document in the live sessions collection
      const res = await setDoc(doc(db, "liveSessions", this.id), {
        mediaId: this.mediaId,
        createdByHcpId: this.createdByHcpId,
        title: this.title,
        description: this.description,
        sessionScheduleDate: this.sessionScheduleDate,
        interests: this.interests,
        reports: this.reports,
        isRecording: this.isRecording,
        isOngoing: this.isOngoing,
        isARecording: this.isARecording,
        liveSessionDuration: this.liveSessionDuration,
        startTime: this.startTime,
        endTime: this.endTime,
        createdAt: this.createdAt,
        updatedAt: this.updatedAt,
      });
    } catch (error) {
      console.error(error);
      throw new Error(error);
    }
  }

}
module.exports.LiveSession = LiveSessionData;
