// /model/reply.js
import { setDoc, doc } from "firebase/firestore";
import { db } from "/firebase/clientApp";

// class to represent a Reply
class Reply {
  /**
   * Thread constructor
   * @param {FirebaseId} id - Reply id
   * @param {string} authorId - User id
   * @param {string} content
   * @param {Date} createdAt
   */
  constructor(id, userId, content) {
    this.replyId = id;
    this.authorId = userId;
    this.content = content;
    this.createdAt = new Date();
  }

  // save the thread to the database
  async save() {
    try {
      // create a new thread document in the thread collection
      console.log("saving a reply", this);
      await setDoc(doc(db, "replies", this.replyId), {
        authorId: this.authorId,
        content: this.content,
        createdAt: this.createdAt,
      });
    } catch (error) {
      console.error(error);
    }
  }

  // TODO: add functions to update reply data
}

module.exports.Reply = Reply;
