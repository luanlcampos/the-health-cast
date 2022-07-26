// /model/thread.js
import { setDoc, doc } from "firebase/firestore";
import { db } from "/firebase/clientApp";

// class to represent a thread
class Thread {
  constructor(id, userId, title, description, content, replies, interests) {
    /**
     * Thread constructor
     * @param {FirebaseId} id - thread id
     * @param {string} authorId - User id
     * @param {string} title
     * @param {string} desc
     * @param {string} content
     * @param {Array} replies
     * @param {Array} interests
     * @param {Date} createdAt
     * @param {Date} activityDate
     */
    this.id = id;
    this.authorId = userId;
    this.title = title;
    this.description = description;
    this.content = content;
    this.replies = replies;
    this.interests = interests;
    this.createdAt = new Date();
    this.activityDate = new Date();
  }

  // save the thread to the database
  async save() {
    try {
      // create a new thread document in the thread collection
      console.log("saving a thread", this);
      await setDoc(doc(db, "threads", this.id), {
        authorId: this.authorId,
        title: this.title,
        description: this.description,
        content: this.description,
        replies: this.replies || 0,
        interests: this.interests,
        createdAt: this.createdAt,
        activityDate: this.activityDate,
      });
    } catch (error) {
      console.error(error);
    }
  }

  // TODO: add functions to update thread data
}

module.exports.Thread = Thread;
