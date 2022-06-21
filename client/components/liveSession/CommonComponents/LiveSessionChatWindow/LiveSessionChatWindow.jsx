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
    console.log("THE USER");
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
    <div id={styles.mainMessagesContainer} className="">
      <h1>This is the room you reside in: {liveSessionRoomID}</h1>
      <div id={styles.mainMessages} className="">
        {messages &&
          messages.map((msg) => (
            <ChatMessage key={`${msg.id}`} currentUser={user} message={msg} />
          ))}

        <span ref={dummy}></span>
      </div>
      <form
        onSubmit={sendMessage}
        id={styles.formSendMessage}
        className="fixed bottom-0 bg-gray-900  flex text-2xl"
      >
        <input
          value={formValue}
          onChange={(e) => setFormValue(e.target.value)}
          placeholder="say something nice"
          className="leading-normal  text-2xl bg-gray-800 text-white pt-0 pb-0 pl-2 pr-2"
          id={styles.inputSendMessage}
        />

        <button
          id={styles.btnSendMessage}
          className="w-1/5 bg-indigo-800"
          type="submit"
          disabled={!formValue}
        >
          🕊️
        </button>
      </form>
    </div>
  );
};

function ChatMessage({ message, currentUser }) {
  const { text, senderUID } = message;
  return (
    <>
      <div
        className={`${styles.message} ${
          senderUID === currentUser.uid ? styles.sent : styles.received
        }`}
      >
        <p id={styles.textContent}>{text}</p>
      </div>
    </>
  );
}

export default LiveSessionChatWindow;
