// /model/thread.js
import { setDoc, doc } from "firebase/firestore";
import { db } from "/firebase/clientApp";

// class to represent a thread
class Thread {
  constructor(id, user, title, desc, replies, users) {
    this.id = id;
    this.author = user;
    this.title = title;
    this.desc = desc;
    this.replies = replies;
    this.users = users;
    this.createdAt = new Date();
    this.activityDate = new Date();
  }

  // save the thread to the database
  async save() {
    try {
      // create a new thread document in the thread collection
      console.log("saving a thread", this);
      await setDoc(doc(db, "threads", this.id), {
        author: this.author,
        title: this.title,
        desc: this.desc,
        replies: this.replies,
        users: this.users,
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
