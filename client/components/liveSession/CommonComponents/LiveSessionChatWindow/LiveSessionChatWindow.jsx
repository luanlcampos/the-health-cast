import React, { useState, useRef } from "react";
import "firebase/firestore";
import "firebase/auth";
import "firebase/analytics";
import {
  collection,
  addDoc,
  query,
  orderBy,
  limit,
  serverTimestamp,
} from "firebase/firestore";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { BiCommentDots } from "react-icons/bi";
import { Timestamp } from "firebase/firestore";

import { useAuth } from "@/firebase/auth";
import { db } from "@/firebase/clientApp";
import styles from "../../../../styles/LiveSessionChatWindow.module.scss";

const LiveSessionChatWindow = ({ liveSessionRoomID }) => {
  const { user, userData } = useAuth();
  const dummy = useRef();
  const messagesRef = collection(
    db,
    "liveSessions",
    `${liveSessionRoomID}`,
    "ManyToManyMessages"
  );

  const givenQuery = query(messagesRef, orderBy("createdAt"), limit(25));

  const [messages] = useCollectionData(givenQuery, { idField: "id" });

  const [formValue, setFormValue] = useState("");

  const sendMessage = async (e) => {
    e.preventDefault();

    // Add a new document with a generated id.
    const docRef = await addDoc(messagesRef, {
      text: formValue,
      senderUID: user.uid,
      senderFirstName: userData.firstName,
      senderLastName: userData.lastName,
      createdAt: serverTimestamp(),
    });

    setFormValue("");
    dummy.current.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div
      style={{
        backgroundImage: `url(https://image.flaticon.com/icons/svg/327/327779.svg)`,
      }}
      className="msger"
    >
      <header className="msger-header ">
        <div className="msger-header-title flex gap-x-4 content-center">
          <BiCommentDots size={25}></BiCommentDots>
          <span className="mx-2">Chat Window</span>
        </div>
      </header>
      <div className={`${styles.msgerChat} .msgerChat`}>
        {messages &&
          messages.map((msg) => (
            <ChatMessage key={`${msg.id}`} currentUser={user} message={msg} />
          ))}

        <span ref={dummy}></span>
      </div>
      <form
        onSubmit={sendMessage}
        id={styles.formSendMessage}
        className="msger-inputarea"
      >
        <input
          value={formValue}
          onChange={(e) => setFormValue(e.target.value)}
          placeholder="say something nice"
          className="msger-input"
          id={styles.inputSendMessage}
        />

        <button
          id={styles.btnSendMessage}
          className="msger-send-btn"
          type="submit"
          disabled={!formValue}
        >
          Send
        </button>
      </form>
    </div>
  );
};

function ChatMessage({ message, currentUser }) {
  const { text, senderUID, senderFirstName, senderLastName, createdAt } =
    message;

  return (
    <>
      <div
        className={`${styles.message} ${
          senderUID === currentUser.uid ? styles.sent : styles.received
        }`}
      >
        <div
          className={`msg-img ${styles.msgImg}`}
          style={{
            backgroundImage: `url(https://cdn-icons-png.flaticon.com/512/1077/1077063.png)`,
          }}
        ></div>
        <div className={`msg-bubble ${styles.msgBubble}`}>
          <div className="msg-info">
            <div className="msg-info-name">{`${senderFirstName} ${senderLastName}`}</div>
            <div className="msg-info-time">
              {createdAt &&
                new Timestamp(createdAt.seconds, createdAt.nanoseconds)
                  .toDate()
                  .toLocaleString("en-us", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
            </div>
          </div>

          <div className="msg-text">
            <p>{text}</p>
          </div>
        </div>
      </div>
    </>
  );
}

export default LiveSessionChatWindow;
