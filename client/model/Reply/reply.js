const { Timestamp } = require("firebase/firestore");

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
    this.createdAt = Timestamp.now();
  }
}
const replyConverter = {
  toFirestore: (reply) => {
    return {
      replyId: reply.replyId,
      authorId: reply.authorId,
      content: reply.content,
      createdAt: reply.createdAt,
    };
  },
  fromFirestore: (snapshot, options) => {
    const data = snapshot.data(options);
    return new Reply(data.replyId, data.authorId, data.content);
  },
};

module.exports = { Reply, replyConverter };
