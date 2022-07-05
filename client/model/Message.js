const { Timestamp } = require("firebase/firestore");

class Message {
    /**
     * User constructor
     * @param {string} text 
     * @param {string} senderEmail 
     * @param {string} recipientEmail 
     * @param {Timestamp} timestamp 
     */
    constructor() {
        this.text = '';
        this.senderEmail = '';
        this.recipientEmail = '';
        this.timestamp = Timestamp.now();
    }
}

module.exports.Message = Message;